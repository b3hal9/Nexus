const cors = require("cors");
const auth = require("../routes/auth");
const postRoutes = require("../routes/post");
const userRoutes = require("../routes/user");
const express = require("express");
const helmet = require("helmet");
const { urlencoded } = require("express");
const error = require("./middlewares/error");

module.exports = function (app) {
  //middlewares

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use(urlencoded({ extended: false }));
  //routes

  app.use("/api", auth);
  app.use("/api", postRoutes);
  app.use("/api", userRoutes);

  app.use(error);
};
