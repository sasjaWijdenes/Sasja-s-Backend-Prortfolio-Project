const db = require("../connection.js");

exports.fetchAllReviews = (category, sort = `created_at`, order = `DESC`) => {
  const queryValues = [],
    categories = ["euro game", "dexterity", "social deduction", "strategy", "hidden-roles", "push-your-luck", "roll-and-write", "deck-building", "engine-building", undefined],
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
  if (!sortValues.includes(sort) || ![`ASC`, `DESC`].includes(order))
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  if (category) {
    queryString += `WHERE reviews.category = $1 `;
    queryValues.push(category);
  }
  queryString += `GROUP BY reviews.review_id ORDER BY ${sort} ${order};`;
  return db
    .query(queryString, queryValues)
    .then(({ rows: reviews }) => {
      return reviews;
    })
    .catch((err) => {
      console.log(err);
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
    return Promise.reject({ status: 400, msg: "Passed malformed body" });
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
exports.updateCommentVotes = (id, votesToAdd) => {
  if (!votesToAdd)
    return Promise.reject({ status: 400, msg: "Passed malformed body" });
  if (typeof votesToAdd !== "number")
    return Promise.reject({
      status: 400,
      msg: "Request body has property of wrong data type.",
    });
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [votesToAdd, id]
  )
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `No user found for user ${id}`,
        });
      } else {
        return review;
      }
    
  })
}

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

exports.addComment = (id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Passed malformed body" });
  }
  return db
    .query(
      `INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, id]
    )
    .then(({ rows: comments }) => {
      return comments[0];
    });
};
