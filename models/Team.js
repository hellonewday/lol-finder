const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema(
  {
    teamname: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    shortname: {
      type: String,
      uppercase: true,
      max: 6,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    description: String,
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    captain: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
    pending: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Team", TeamSchema);
