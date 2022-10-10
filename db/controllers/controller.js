const { fetchAllCategories } = require("../models/models.js");

exports.getAllCategories = (req, res) => {
  fetchAllCategories().then((categories) => {
    return res.status(200).send({ categories });
  });
};
