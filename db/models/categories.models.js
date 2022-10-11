const db = require("../connection.js");

exports.fetchAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => rows);
};
