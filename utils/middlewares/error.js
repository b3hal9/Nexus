const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err); //warn,info,verbose,debug,silly are other error labels
  //log the exception here
  res.status(500).send("Something failed");
};
