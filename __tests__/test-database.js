const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

async function getTestDbConnection() {
	return open({
		filename: './test-database.sqlite',
		driver: sqlite3.Database,
	})
}

async function initializeTestDb() {
	const db = await getTestDbConnection()
	await createTables(db)
	return db
}

async function createTables(db) {
	// Create the 'recipes' table to store recipe information
	await db.exec(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT,
    method TEXT
  )`)

	// Create the 'users' table for authentication
	await db.exec(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
		username TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL
	)`)

	// Create the 'favorites' table to link users to recipes
	await db.exec(`CREATE TABLE IF NOT EXISTS favorites (
		id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
		user_id INTEGER NOT NULL,
		recipe_id INTEGER NOT NULL,
		UNIQUE(user_id, recipe_id)
	)`)
}

module.exports = { getTestDbConnection, initializeTestDb }
