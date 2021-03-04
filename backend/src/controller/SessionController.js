const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  async store(req, res) {
    return res.status(200).send();
  },
  async index(req, res) {},
  show(req, res) {},
  destroy(req, res) {},
  update(req, res) {},
};
