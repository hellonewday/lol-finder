const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  ingame: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: true,
  },
  ingameUrl: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    enum: [
      "Sắt",
      "Đồng",
      "Bạc",
      "Vàng",
      "Bạch Kim",
      "Kim Cương",
      "Cao thủ",
      "Đại cao thủ",
      "Thách đấu",
    ],
    required: true,
  },
  role: {
    type: [String],
    required: true,
  },
  isFind: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
