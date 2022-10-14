const db = require("../connection.js");

exports.fetchAllReviews = (category, sort = `created_at`) => {
  const queryValues = [sort],
    categories = ["euro game", "dexterity", "social deduction", undefined],
    sortValues = [
      `title`,
      `designer`,
      `owner`,
      `category`,
      `created_at`,
      `votes`,
    ];
  let queryString = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (!categories.includes(category))
    return Promise.reject({ status: 404, msg: "No such category" });
  if (!sortValues.includes(sort))
    return Promise.reject({ status: 404, msg: "Invalid sort query" });
  if (category) {
    console.log({ category });
    queryString += `WHERE reviews.category = $2 `;
    queryValues.push(category);
  }
  queryString += `GROUP BY reviews.review_id ORDER BY $1 DESC;`;
  console.log({ queryString, queryValues });
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
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows: comments }) => comments);
};
