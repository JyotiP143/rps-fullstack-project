const express = require("express");
const Game = require("../models/Game");

const router = express.Router();

// Save game result
router.post("/play", async (req, res) => {
  try {
    const {
      playerName,
      playerChoice,
      computerChoice,
      result,
      score,
    } = req.body;

    const game = await Game.create({
      playerName,
      playerChoice,
      computerChoice,
      result,
      score,
    });

    res.status(201).json({
      message: "Game saved successfully",
      game,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save game",
      error: error.message,
    });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Game.aggregate([
      {
        $group: {
          _id: "$playerName",
          totalScore: {
            $sum: "$score",
          },
          gamesPlayed: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalScore: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load leaderboard",
      error: error.message,
    });
  }
});

module.exports = router;