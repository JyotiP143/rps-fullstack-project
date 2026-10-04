const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
      trim: true,
    },

    playerChoice: {
      type: String,
      required: true,
    },

    computerChoice: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);