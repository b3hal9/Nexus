const mongoose = require("mongoose");
const winston = require("winston");

//DB Connection
mongoose
  .connect("mongodb://localhost:27017/Pms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    winston.info("connected to database...");
  });
