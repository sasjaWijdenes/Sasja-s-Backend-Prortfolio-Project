const {
  fetchAllCategories,
  fetchReviewById,
  fetchAllUsers,
} = require("../models/models.js");

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
exports.getAllUsers = (rec, res, next) => {
  fetchAllUsers().then((users) => res.status(200).send({ users }));
};
exports.getReviewById = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewById(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
