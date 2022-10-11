const { fetchAllUsers } = require("../models/users.models.js");

exports.getAllUsers = (rec, res, next) => {
  fetchAllUsers().then((users) => res.status(200).send({ users }));
};
