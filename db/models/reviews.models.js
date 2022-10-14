const db = require("../connection.js");

exports.fetchAllReviews = (category) => {
  const queryValues = [],
    categories = ["euro game", "dexterity", "social deduction", undefined];
  let queryString = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (!categories.includes(category))
    return Promise.reject({ status: 404, msg: "No such category" });
  if (category) {
    queryString += `WHERE reviews.category = $1 `;
    queryValues.push(category);
  }
  queryString += `GROUP BY reviews.review_id;`;
  return db.query(queryString, queryValues).then(({ rows: reviews }) => {
    return reviews;
  });
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

exports.updateReviewVotes = (id, votesToAdd) => {
  if (!votesToAdd)
    return Promise.reject({ status: 404, msg: "Passed malformed body" });
  if (typeof votesToAdd !== "number")
    return Promise.reject({
      status: 400,
      msg: "Request body has property of wrong data type.",
    });
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

exports.fetchCommentsByReviewId = (id) => {
  const validCheck = db.query(
    `SELECT review_id FROM reviews WHERE review_id = $1;`,
    [id]
  );
  const comments = db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows: comments }) => comments);
  return Promise.all([validCheck, comments]).then(([result, comments]) => {
    if (result.rows.length < 1)
      return Promise.reject({ status: 404, msg: "Review does not exist" });
    return comments;
  });
};
