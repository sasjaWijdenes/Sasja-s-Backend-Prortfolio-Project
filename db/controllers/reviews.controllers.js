const {
  fetchReviewById,
  updateReviewVotes,
} = require("../models/reviews.models.js");

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
  // console.log(typeof votes, ":", votes, "<<<votes");
  if (!votes) next({ status: 404, msg: "Passed malformed body" });
  if (typeof votes !== "number")
    next({ status: 400, msg: "Request body has property of wrong data type." });
  updateReviewVotes(id, votes)
    .then((review) => {
      // console.log(review, "<<<review");
      res.status(200).send({ review });
    })
    .catch(next);
};
