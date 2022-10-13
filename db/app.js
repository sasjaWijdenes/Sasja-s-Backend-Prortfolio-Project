const express = require("express"),
  { getAllCategories } = require("./controllers/categories.controllers.js"),
  { getAllUsers } = require("./controllers/users.controllers.js"),
  {
    getReviewById,
    incrementVotes,
    getAllReviews,
    getCommentsByReviewId,
  } = require("./controllers/reviews.controllers.js"),
  app = express();

app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/users", getAllUsers);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.patch("/api/reviews/:review_id", incrementVotes);

app.all("*", (req, res) =>
  res.status(404).send({ msg: "That route does not exist" })
);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  res.status(400).send({ msg: "Invalid Id" });
});

module.exports = app;
