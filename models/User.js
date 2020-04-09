const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 20,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
});

UserSchema.methods.getAuthToken = (user) => {
  // console.log(user._id);
  // console.log(user.isAdmin);
  const token = jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
    },
    config.get("myPrivateKey"),
    {
      expiresIn: "12h",
    }
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);

module.exports.validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(10).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });
  return schema.validate(user);
};
