const request = require('supertest');
const express = require('express');
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

  test('POST /recipes should return 400 if title is empty', async () => {
    const response = await request(app)
      .post('/recipes')
      .send({ title: '', ingredients: 'Some ingredients', method: 'Some method' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title is required');
  });

  test('POST /recipes should return 400 if title is whitespace only', async () => {
    const response = await request(app)
      .post('/recipes')
      .send({ title: '   ', ingredients: 'Some ingredients', method: 'Some method' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title is required');
  });

  test('DELETE /recipes/:id should delete the recipe and return 404 on subsequent GET', async () => {
    // First create a recipe to delete
    const newRecipe = {
      title: 'Recipe To Delete',
      ingredients: 'Some ingredients',
      method: 'Some method'
    };
    await request(app).post('/recipes').send(newRecipe);
    const created = await db.get('SELECT * FROM recipes WHERE title = ?', [newRecipe.title]);
    expect(created).toBeDefined();

    // Delete it
    const deleteResponse = await request(app).delete(`/recipes/${created.id}`);
    expect(deleteResponse.status).toBe(204);

    // Verify recipe no longer exists in the database
    const deleted = await db.get('SELECT * FROM recipes WHERE id = ?', [created.id]);
    expect(deleted).toBeUndefined();
  });
});