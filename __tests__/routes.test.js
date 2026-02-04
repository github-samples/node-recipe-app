const request = require('supertest');
const express = require('express');
const session = require('express-session');
const routes = require('../src/routes');
const { initializeTestDb } = require('./test-database');

// Mock the database module to use test database
jest.mock('../src/database', () => ({
  getDbConnection: () => require('./test-database').getTestDbConnection()
}));

// Simple app setup for testing
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: 'test-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true },
    })
  );
  
  // Simple mock for res.render
  app.use((req, res, next) => {
    res.render = (view, locals) => res.json({ view, locals });
    next();
  });
  
  app.use('/', routes);
  return app;
}

describe('Routes', () => {
  let app;
  let db;

  beforeEach(async () => {
    app = createTestApp();
    db = await initializeTestDb();
  });

  afterEach(async () => {
    if (db) {
      await db.close();
    }
  });

  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.view).toBe('home');
  });

  test('POST /recipes should create a new recipe', async () => {
    const newRecipe = {
      title: 'New Test Recipe',
      ingredients: 'New test ingredients',
      method: 'New test method'
    };

    const response = await request(app)
      .post('/recipes')
      .send(newRecipe);

    expect(response.status).toBe(302); // Redirect status
    expect(response.headers.location).toBe('/recipes');

    // Verify recipe was created
    const recipe = await db.get('SELECT * FROM recipes WHERE title = ?', [newRecipe.title]);
    expect(recipe).toBeDefined();
    expect(recipe.title).toBe(newRecipe.title);
  });

  test('POST /register should create a new user and redirect to profile', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/profile');

    const user = await db.get('SELECT * FROM users WHERE username = ?', ['testuser']);
    expect(user).toBeDefined();
  });

  test('POST /login should authenticate and redirect to profile', async () => {
    await request(app)
      .post('/register')
      .send({ username: 'loginuser', password: 'password123' });

    const response = await request(app)
      .post('/login')
      .send({ username: 'loginuser', password: 'password123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/profile');
  });

  test('GET /profile should redirect to login when not authenticated', async () => {
    const response = await request(app).get('/profile');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('POST /recipes/:id/favorite should save a recipe for the user', async () => {
    const agent = request.agent(app);
    await agent
      .post('/register')
      .send({ username: 'favuser', password: 'password123' });

    await agent
      .post('/recipes')
      .send({ title: 'Favorite Recipe', ingredients: 'Test', method: 'Test' });

    const recipe = await db.get('SELECT * FROM recipes WHERE title = ?', ['Favorite Recipe']);
    expect(recipe).toBeDefined();

    const response = await agent
      .post(`/recipes/${recipe.id}/favorite`)
      .send();

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`/recipes/${recipe.id}`);

    const favorite = await db.get('SELECT * FROM favorites WHERE recipe_id = ?', [recipe.id]);
    expect(favorite).toBeDefined();
  });

  test('POST /recipes/:id/unfavorite should remove a saved recipe', async () => {
    const agent = request.agent(app);
    await agent
      .post('/register')
      .send({ username: 'unfavuser', password: 'password123' });

    await agent
      .post('/recipes')
      .send({ title: 'Unfavorite Recipe', ingredients: 'Test', method: 'Test' });

    const recipe = await db.get('SELECT * FROM recipes WHERE title = ?', ['Unfavorite Recipe']);
    expect(recipe).toBeDefined();

    await agent.post(`/recipes/${recipe.id}/favorite`).send();

    const response = await agent
      .post(`/recipes/${recipe.id}/unfavorite`)
      .send();

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`/recipes/${recipe.id}`);

    const favorite = await db.get('SELECT * FROM favorites WHERE recipe_id = ?', [recipe.id]);
    expect(favorite).toBeUndefined();
  });

    test('POST /recipes/:id/delete should delete a recipe', async () => {
      // 先插入一条菜谱
      const recipe = {
        title: 'Delete Me',
        ingredients: 'To be deleted',
        method: 'To be deleted'
      };
      await request(app).post('/recipes').send(recipe);
      const created = await db.get('SELECT * FROM recipes WHERE title = ?', [recipe.title]);
      expect(created).toBeDefined();

      // 执行删除
      const response = await request(app)
        .post(`/recipes/${created.id}/delete`)
        .send();
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/recipes');

      // 验证已删除
      const deleted = await db.get('SELECT * FROM recipes WHERE id = ?', [created.id]);
      expect(deleted).toBeUndefined();
    });
});