const {
  fetchReviewById,
  updateReviewVotes,
  fetchAllReviews,
} = require("../models/reviews.models.js");

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewById = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewById(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.incrementVotes = (req, res, next) => {
  const {
    params: { review_id: id },
    body: { inc_votes: votes },
  } = req;
  updateReviewVotes(id, votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
