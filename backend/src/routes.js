const express = require("express");

const uploadConfig = require("./config/upload");
const multer = require("multer");
const upload = multer(uploadConfig);

const route = express.Router();

const PostController = require("./controller/PostController");
const LikeController = require("./controller/LikeController");
const UserController = require("./controller/UserController");
const SessionController = require("./controller/SessionController");

route.post("/posts", upload.single("image"), PostController.store);
route.get("/posts", PostController.index);
route.post("/posts/:id/like", LikeController.store);

route.post("/sessions", SessionController.store);
route.post("/signin", UserController.show);
route.post("/signup", UserController.store);

route.get("/testemail", UserController.index);
module.exports = route;
