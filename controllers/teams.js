const Team = require("../models/Team");
const cloudinary = require("cloudinary").v2;
const config = require("config");

cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

module.exports.allTeams = (req, res, next) => {
  Team.find()
    .populate({
      path: "captain",
      select: "location ingame rank role",
    })
    .exec((error, doc) => {
      if (error) return res.status(400).json({ counts: 0, error });
      else return res.status(200).json({ counts: doc.length, data: doc });
    });
};

module.exports.oneTeam = (req, res, next) => {
  Team.findOne({ _id: req.params.id })
    .populate({
      path: "captain",
      select: "location ingame rank role",
    }).populate({
      path: "pending",
      select: "location ingame rank role"
    }).populate({
      path: "members",
      select: "location ingame rank role"
    })
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
    return res
      .status(403)
      .json({ message: "Team name has already been taken" });
  if (!req.file) {
    let team = new Team({
      teamname: req.body.teamname,
      shortname: req.body.shortname ? req.body.shortname : "",
      description: req.body.description ? req.body.description : "",
      captain: req.player._id,
    });

    team.save((error, doc) => {
      if (error) return res.status(400).json({ error });
      else return res.status(201).json({ success: true, document: doc });
    });
  } else if (req.file) {
    const buffer = Buffer.from(req.file.buffer);
    const base64String = buffer.toString("base64");
    const input = "data:image/jpeg;base64," + base64String;
    cloudinary.uploader
      .upload(input, {
        overwrite: true,
        invalidate: true,
      })
      .then((document) => {
        let fileTeam = new Team({
          teamname: req.body.teamname,
          logo: document.secure_url,
          shortname: req.body.shortname ? req.body.shortname : "",
          description: req.body.description ? req.body.description : "",
          captain: req.player._id,
        });
        fileTeam.save((error, document) => {
          if (error) return res.status(400).json({ error });
          else return res.status(201).json({ success: true, document });
        });
      });
  }
};

module.exports.updateTeam = async (req, res, next) => {
  let isValid = await Team.findOne({ _id: req.params.id });
  if (!isValid) return res.status(404).json({ message: "Not found team" });
  else if (req.player._id.toString() !== isValid.captain.toString()) {
    res.status(401).json({
      message: "You must be the captain to do this action",
    });
  }
  // Case 1: update basic information without logo
  if (!req.body.pending && !req.body.members) {
    console.log("No pending or members update here");
    if (!req.file) {
      Team.updateOne({ _id: req.params.id }, req.body)
        .exec()
        .then((response) => {
          res.status(200).json({ success: true, response });
        })
        .catch((error) => {
          res.status(201).json({ success: false, error });
        });
    } else if (req.file) {
      const buffer = Buffer.from(req.file.buffer);
      const base64String = buffer.toString("base64");
      const input = "data:image/jpeg;base64," + base64String;
      cloudinary.uploader
        .upload(input, {
          overwrite: true,
          invalidate: true,
        })
        .then((document) => {
          let update = {
            teamname: req.body.teamname ? req.body.teamname : isValid.teamname,
            logo: document.secure_url,
            shortname: req.body.shortname
              ? req.body.shortname
              : isValid.shortname,
            description: req.body.description
              ? req.body.description
              : isValid.description,
          };

          Team.updateOne({ _id: req.params.id }, update)
            .exec()
            .then((response) => {
              res.status(200).json({ success: true, response });
            })
            .catch((error) => {
              res.status(400).json({ success: false, error });
            });
        });
    }
  } else if (req.body.pending) {
    console.log("Pending");
    console.log(req.body.type);
    switch (req.body.type) {
      case "add":
        Team.updateOne(
          { _id: req.params.id },
          { $push: { pending: { $each: req.body.pending.split(",") } } }
        ).exec((error, response) => {
          if (error) return res.status(400).json({ error });
          else return res.status(200).json({ response });
        });
      case "remove":
        Team.updateOne(
          { _id: req.params.id },
          { $pull: { pending: { $in: req.body.pending } } }
        );
    }
  } else if (req.body.members) {
    console.log("Member");
    console.log(req.body.type);
    switch (req.body.type) {
      case "add":
        if (isValid.members.length >= 5)
          return res.status(403).json({
            success: false,
            message: "Your team has already been full",
          });
        else {
          // Remove from pending list.
          // Add them in member list
          // return Team.updateOne({});
        }
      case "remove":
        Team.updateOne({});
      default:
        res.status(400).json({ message: "No type were specified" });
    }
  }
};

module.exports.removeTeam = async (req, res, next) => {
  // Validation
  let isValid = await Team.findOne({ _id: req.params.id });
  if (!isValid) return res.status(404).json({ message: "Not found" });
  else if (req.player._id.toString() !== isValid.captain.toString()) {
    res.status(401).json({
      message: "You must be the captain to do this action",
    });
  } else {
    Team.findByIdAndDelete({ _id: req.params.id })
      .exec()
      .then((response) => {
        res.status(200).json({
          success: true,
          response,
        });
      })
      .catch((error) => {
        res.status(400).json({ success: false, error });
      });
  }
};

// module.exports.testAPI = (req,res,next) => {
//   res.send("Hello World");
// }
