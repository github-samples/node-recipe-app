const express = require('express')
const { getDbConnection } = require('./database')

const router = express.Router()

router.get('/', (req, res) => {
	res.render('home', { title: 'Recipe App' })
})

router.get('/recipes', async (req, res) => {
	const db = await getDbConnection()
	const recipes = await db.all('SELECT * FROM recipes ORDER BY title')
	res.render('recipes', { recipes })
})

router.get('/recipes/:id', async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', [recipeId])
	res.render('recipe', { recipe })
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

router.post('/recipes/:id/delete', async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	await db.run('DELETE FROM recipes WHERE id = ?', [recipeId])
	res.redirect('/recipes')
})
router.get('/random', async (req, res) => {
	const db = await getDbConnection()
	const recipe = await db.get('SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1')
	res.render('recipe', { recipe })
})

module.exports = router
