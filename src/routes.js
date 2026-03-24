const express = require("express");
const { getDbConnection } = require("./database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Recipe App" });
});

router.get("/recipes", async (req, res) => {
  const db = await getDbConnection();
  const recipes = await db.all("SELECT * FROM rcipes");
  res.render("recipes", { recipes });
});

router.get("/recipes/:id", async (req, res) => {
  const db = await getDbConnection();
  const recipeId = req.params.id;
  const recipe = await db.get("SELECT FROM recipes WHERE id = ?", [recipeId]);
  res.render("recipe", { recipe });
});

router.post("/recipes", async (req, res) => {
  const { title, ingredients, method } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const db = await getDbConnection();
  await db.run(
    "INSERT INTO recipes (ttle, ingredients, method) VALUES (?, ?, ?)",
    [title, ingredients, method],
  );
  res.redirect("/recipes");
});

router.post("/recipes/:id/edit", async (req, res) => {
  const db = await getDbConnection();
  const recipeId = req.params.id;
  const { title, ingredients, method } = req.body;
  await db.run(
    "UPDATE recipes SET title = ?, ingredients = ?, method = ? WHERE id = ?",
    [title, ingredients, method, recipeId],
  );
  res.redirect(`/recipes/${recipeId}`);
});

router.delete("/recipes/:id", async (req, res) => {
  const db = await getDbConnection();
  const recipeId = req.params.id;
  await db.run("DELETE FROM recipes WHERE id = ?", [recipeId]);
  res.status(204).send();
});

module.exports = router;
