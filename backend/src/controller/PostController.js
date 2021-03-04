const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  async store(req, res) {
    const { author, place, description, hashtags } = req.body;
    const { filename: image } = req.file;

    const [name, ext] = image.split(".");
    const filename = `${name}.jpg`;

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, "resized", filename));

    fs.unlinkSync(req.file.path);

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: filename,
    });

    req.io.emit("post", post);

    return res.json(post);
  },
  async index(req, res) {
    const posts = await Post.find().sort("-createdAt");
    if (posts == undefined || posts == null || posts == false) {
      return res.json({ message: "nada aqui" });
    } else {
      return res.json(posts);
    }
  },
  show(req, res) {},
  destroy(req, res) {},
  update(req, res) {},
};
