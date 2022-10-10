const express = require("express"),
  app = express();
const { getAllCategories } = require("./controllers/controller.js");

app.use(express.json());

app.get("/api/categories", getAllCategories);

module.exports = app;
