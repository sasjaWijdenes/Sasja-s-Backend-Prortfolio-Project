const db = require("../connection.js");

exports.fetchAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((data) => {
    const { rows } = data;
    return rows;
  });
};
exports.fetchReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
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