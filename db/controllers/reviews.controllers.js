const {
  fetchReviewById,
  updateReviewVotes,
  fetchAllReviews,
  fetchCommentsByReviewId,
  addComment,
} = require("../models/reviews.models.js");

exports.getAllReviews = (req, res, next) => {
  const { sort } = req.query;
  fetchAllReviews(sort)
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
  fetchCommentsByReviewId(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments });
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
      // console.log(review, "<<<review");
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const {
    params: { review_id },
    body: { username, body },
  } = req;
  addComment(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
