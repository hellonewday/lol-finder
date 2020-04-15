const { validateUser } = require("../models/User");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

module.exports.allUsers = (req, res, next) => {
  User.find()
    .populate("player")
    .exec((err, doc) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      res.status(200).json({ data: doc, counts: doc.length });
    });
};

module.exports.oneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }).exec((error, document) => {
    if (error) {
      res.status(400).json({ error });
    }
    res.status(200).json({ data: document });
  });
};

module.exports.registerUser = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  data.password = await bcrypt.hash(req.body.password, 10);

  await data
    .save()
    .then((response) => {
      res.status(201).json({ success: true, response });
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err });
    });
};

module.exports.loginUser = async (req, res, next) => {
  let isValid = await User.findOne({ email: req.body.email });
  if (!isValid) return res.status(404).json({ message: "Not Found" });

  bcrypt.compare(req.body.password, isValid.password, (error, success) => {
    if (error) {
      res.status(400).json({ success: false });
    } else {
      const token = jwt.sign(
        {
          _id: isValid._id,
          isAdmin: isValid.isAdmin,
        },
        config.get("myPrivateKey"),
        {
          expiresIn: "12h",
        }
      );
      res.status(200).json({ success: true, token, id: isValid._id });
    }
  });
};

module.exports.deleteUser = async (req, res, next) => {
  let isValid = await User.findOne({ _id: req.params.id });
  if (!isValid) return res.status(404).json({ message: "Not Found" });
  if (isValid._id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You are not allowed to do this action" });
  }
  User.deleteOne({ _id: isValid._id })
    .exec()
    .then((response) => {
      res.status(200).json({ success: true, response });
    })
    .catch((error) => {
      res.status(400).json({ success: false, error });
    });
};
