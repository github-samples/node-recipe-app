const express = require('express')
const bcrypt = require('bcryptjs')
const { getDbConnection } = require('./database')

const router = express.Router()

function requireAuth(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/login')
	}
	return next()
}

router.get('/', (req, res) => {
	res.render('home', { title: 'Recipe App' })
})

router.get('/recipes', async (req, res) => {
	const db = await getDbConnection()
	const recipes = await db.all('SELECT * FROM recipes ORDER BY title DESC')
	res.render('recipes', { recipes })
})

router.get('/recipes/:id', async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', [recipeId])
	let isFavorited = false

	if (req.session.user && recipe) {
		const favorite = await db.get(
			'SELECT id FROM favorites WHERE user_id = ? AND recipe_id = ?',
			[req.session.user.id, recipeId]
		)
		isFavorited = Boolean(favorite)
	}

	res.render('recipe', { recipe, isFavorited })
})

router.get('/register', (req, res) => {
	res.render('register')
})

router.post('/register', async (req, res) => {
	const db = await getDbConnection()
	const { username, password } = req.body

	if (!username || !password) {
		return res.render('register', { error: 'Username and password are required.' })
	}

	const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username])
	if (existingUser) {
		return res.render('register', { error: 'Username already exists.' })
	}

	const passwordHash = await bcrypt.hash(password, 10)
	await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash])
	const createdUser = await db.get('SELECT id, username FROM users WHERE username = ?', [username])
	req.session.user = { id: createdUser.id, username: createdUser.username }
	return res.redirect('/profile')
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.post('/login', async (req, res) => {
	const db = await getDbConnection()
	const { username, password } = req.body

	if (!username || !password) {
		return res.render('login', { error: 'Username and password are required.' })
	}

	const user = await db.get('SELECT * FROM users WHERE username = ?', [username])
	if (!user) {
		return res.render('login', { error: 'Invalid username or password.' })
	}

	const passwordMatches = await bcrypt.compare(password, user.password_hash)
	if (!passwordMatches) {
		return res.render('login', { error: 'Invalid username or password.' })
	}

	req.session.user = { id: user.id, username: user.username }
	return res.redirect('/profile')
})

router.post('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})

router.get('/profile', requireAuth, async (req, res) => {
	const db = await getDbConnection()
	const favorites = await db.all(
		`SELECT recipes.*
		 FROM recipes
		 INNER JOIN favorites ON favorites.recipe_id = recipes.id
		 WHERE favorites.user_id = ?
		 ORDER BY recipes.title ASC`,
		[req.session.user.id]
	)
	res.render('profile', {
		user: req.session.user,
		favorites,
		hasFavorites: favorites.length > 0,
	})
})

router.post('/recipes/:id/favorite', requireAuth, async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	await db.run('INSERT OR IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)', [
		req.session.user.id,
		recipeId,
	])
	res.redirect(`/recipes/${recipeId}`)
})

router.post('/recipes/:id/unfavorite', requireAuth, async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	await db.run('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?', [
		req.session.user.id,
		recipeId,
	])
	res.redirect(`/recipes/${recipeId}`)
})

router.post('/recipes', async (req, res) => {
	const db = await getDbConnection()
	const { title, ingredients, method } = req.body
	await db.run('INSERT INTO recipes (title, ingredients, method) VALUES (?, ?, ?)', [title, ingredients, method])
	res.redirect('/recipes')
})

router.post('/recipes/:id/edit', async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const { title, ingredients, method } = req.body
	await db.run('UPDATE recipes SET title = ?, ingredients = ?, method = ? WHERE id = ?', [
		title,
		ingredients,
		method,
		recipeId,
	])
	res.redirect(`/recipes/${recipeId}`)
})

// 删除菜谱
router.post('/recipes/:id/delete', async (req, res) => {
	const db = await getDbConnection();
	const recipeId = req.params.id;
	await db.run('DELETE FROM recipes WHERE id = ?', [recipeId]);
	res.redirect('/recipes');
});

// 获取一个随机菜谱
router.get('/recipes/random', async (req, res) => {
	const db = await getDbConnection()
	const recipe = await db.get('SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1')
	res.render('recipe', { recipe })
})

module.exports = router
