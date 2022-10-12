const db = require("../connection.js");

exports.fetchAllReviews = (sort) => {
  const queryValues = [],
    categories = ["euro game", "dexterity", "social deduction", undefined];
  let queryString = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (!categories.includes(sort))
    return Promise.reject({ status: 404, msg: "No such category" });
  if (sort) {
    queryString += `WHERE reviews.category = $1 `;
    queryValues.push(sort);
  }
  queryString += `GROUP BY reviews.review_id;`;
  return db
    .query(queryString, queryValues)
    .then(({ rows: reviews }) => {
      return reviews;
    })
    .catch((err) => console.log(err));
};

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

exports.fetchCommentsByReviewId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows: comments }) => comments);
};
