const express = require("express"),
  app = express();
const { getAllCategories } = require("./controllers/controller.js");

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.all("*", (req, res) =>
  res.status(404).send({ msg: "That route does not exist" })
);

module.exports = app;
