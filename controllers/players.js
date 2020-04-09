const Player = require("../models/Player");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "vn-esports",
  api_key: "996178356223912",
  api_secret: "rC8_6QyIf1DIbokVgSYe0VLsJwQ",
});

module.exports.allPlayers = (req, res, next) => {
  Player.find()
    .populate("user")
    .exec((error, doc) => {
      if (error) {
        res.status(400).json({ error });
      } else return res.status(200).json({ counts: doc.length, data: doc });
    });
};

module.exports.onePlayer = (req, res, next) => {
  Player.findOne().exec((error, document) => {
    if (error) {
      res.status(400).json({ error });
    } else return res.status(200).json({ data: document });
  });
};

module.exports.addPlayer = (req, res, next) => {
  const buffer = Buffer.from(req.file.buffer);
  const base64String = buffer.toString("base64");
  const input = "data:image/jpeg;base64," + base64String;
  cloudinary.uploader
    .upload(input, {
      overwrite: true,
      invalidate: true,
    })
    .then((document) => {
      let player = new Player({
        ingame: req.body.ingame,
        location: req.body.location ? req.body.location : "",
        contact: req.body.contact,
        ingameUrl: document.secure_url,
        rank: req.body.rank,
        role: req.body.role.split(","), // Temporary
        isFind: Boolean(req.body.isFind),
        user: req.user._id,
      });

      player.save((error, document) => {
        if (error) return res.status(400).json({ error });
        else return res.status(201).json({ success: true, document });
      });
    })
    .catch((error) => {
      res.json(error);
    });
};

module.exports.removePlayer = async (req, res, next) => {
  let isValid = await Player.findOne({ _id: req.params.id });
  if (!isValid)
    return res
      .status(404)
      .json({ success: false, message: "Player not found" });

  if (isValid._id !== req.user._id)
    return res
      .status(402)
      .json({ message: "You don't have permissions to do this action" });

     
};
