const Player = require("../models/Player");
const cloudinary = require("cloudinary").v2;
const config = require("config");

cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
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

module.exports.updatePlayer = async (req, res, next) => {
  let isValid = await Player.findOne({ _id: req.params.id });
  if (!isValid) return res.status(404).json({ message: "Player not found" });
  console.log(req.file);
  if (!req.file) {
    let player = {
      ingame: req.body.ingame ? req.body.ingame : isValid.ingame,
      location: req.body.location ? req.body.location : isValid.location,
      contact: req.body.contact ? req.body.contact : isValid.contact,
      ingameUrl: isValid.ingameUrl,
      rank: req.body.rank ? req.body.rank : isValid.rank,
      role: req.body.role ? req.body.role.split(",") : isValid.role, // Temporary
      isFind: req.body.isFind ? Boolean(req.body.isFind) : isValid.isFind,
      user: req.user._id,
    };

    Player.updateOne({ _id: req.params.id }, player)
      .exec()
      .then((response) => {
        res.status(200).json({ success: true, response });
      })
      .catch((error) => {
        res.status(400).json({ success: false, error });
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
        let filePlayer = {
          ingame: req.body.ingame ? req.body.ingame : isValid.ingame,
          location: req.body.location ? req.body.location : isValid.location,
          contact: req.body.contact ? req.body.contact : isValid.contact,
          ingameUrl: document.secure_url,
          rank: req.body.rank ? req.body.rank : isValid.rank,
          role: req.body.role ? req.body.role.split(",") : isValid.role, // Temporary
          isFind: req.body.isFind ? Boolean(req.body.isFind) : isValid.isFind,
          user: req.user._id,
        };
        Player.updateOne({ _id: req.params.id }, filePlayer)
          .exec()
          .then((response) => {
            res.status(200).json({ success: true, response });
          })
          .catch((error) => {
            res.status(400).json({ success: false, error });
          });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
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
