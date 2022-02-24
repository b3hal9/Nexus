module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("Fatal error:JwtPrivateKey is not defined");
  }
};
