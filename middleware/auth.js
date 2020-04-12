const jwt = require("jsonwebtoken");
const config = require("config");
const Player = require("../models/Player");

module.exports = async function (req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, config.get("myPrivateKey"));
    req.user = decoded;
    console.log(decoded);
    req.player = await Player.findOne({ user: decoded._id });
    next();
  } catch (ex) {
    console.log(ex);
    res.status(400).send("Invalid token.");
  }
};
