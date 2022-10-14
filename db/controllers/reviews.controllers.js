const {
  fetchReviewById,
  updateReviewVotes,
  fetchAllReviews,
  fetchCommentsByReviewId,
} = require("../models/reviews.models.js");

exports.getAllReviews = (req, res, next) => {
  const { category, sort, order } = req.query;
  fetchAllReviews(category, sort, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  fetchReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  fetchCommentsByReviewId(req.params.review_id).then((comments) => {
    res.status(200).send({ comments });
  });
};

exports.incrementVotes = (req, res, next) => {
  const {
    params: { review_id: id },
    body: { inc_votes: votes },
  } = req;
  updateReviewVotes(id, votes)
    .then((review) => {
      // console.log(review, "<<<review");
      res.status(200).send({ review });
    })
    .catch(next);
};
