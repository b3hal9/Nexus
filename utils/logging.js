require("express-async-errors");
require("winston-mongodb");
const winston = require("winston");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "allLogFile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      level: "info", //info is level 3 so it will store error,warn,info
    })
  );
  //handling exception outside request pipeline i.e out of express
  new winston.ExceptionHandler(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "unCaughtExceptions.log" })
  );
  new winston.RejectionHandler(
    new winston.transports.Console({ colorize: true, prettyPrint: true }), //showing on our console
    new winston.transports.File({ filename: "unHandleRejections.log" }) //logging in file
  );
};
