const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3335;

try {
  const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dlweq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (erro) => {
      erro ? console.log(erro) : console.log(`Connect successfull on Database`);
    }
  );
} catch (error) {
  console.log(`Problem connection on Database. Erro: ${error}`);
}

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resized"))
);

app.use(routes);

server.listen(port, console.log(`Backend is Running on Port: ${port}`));
