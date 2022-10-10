const express = require("express"),
  app = express();
const {
  getAllCategories,
  getReviewById,
  getAllUsers,
} = require("./controllers/controller.js");

app.get("/api/categories", getAllCategories);
app.get("/api/users", getAllUsers);
app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  res.status(400).send({ msg: "Invalid Id" });
});

app.all("*", (req, res) =>
  res.status(404).send({ msg: "That route does not exist" })
);

module.exports = app;
