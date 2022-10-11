const db = require("../connection.js");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};
