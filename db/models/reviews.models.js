const db = require("../connection.js");

exports.fetchReviewById = (id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows }) => {
      const review = rows[0];
      return !review
        ? Promise.reject({
            status: 404,
            msg: `No user found for user ${id}`,
          })
        : review;
    });
};
exports.updateReviewVotes = (id, votesToAdd) => {
  if (!votesToAdd)
    return Promise.reject({ status: 404, msg: "Passed malformed body" });
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [votesToAdd, id]
    )
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No user found for user ${id}`,
        });
      } else {
        return review;
      }
    });
};
