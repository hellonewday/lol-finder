const Team = require("../models/Team");
const cloudinary = require("cloudinary").v2;
const config = require("config");

cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

module.exports.allTeams = (req, res, next) => {
  Team.find().exec((error, doc) => {
    if (error) return res.status(400).json({ counts: 0, error });
    else return res.status(200).json({ counts: doc.length, data: doc });
  });
};

module.exports.oneTeam = (req, res, next) => {
  Team.findOne({ _id: req.params.id })
    .exec()
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

module.exports.addTeam = async (req, res, next) => {
  // Có ảnh team hoặc không có ảnh team.
  let isValid = await Team.findOne({ teamname: req.body.teamname });
  if (isValid)
    return res.status(403).json({ message: "Team has already been taken" });
  if (!req.file) {
  } else if (req.file) {
  }
};

module.exports.updateTeam = (req, res, next) => {
  // Update members from pending.
  // Remove members.
  //
};

module.exports.removeTeam = (req, res, next) => {};
