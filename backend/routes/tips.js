const express = require("express");
const router = express.Router();
const Tip = require("../models/Tip");
const auth = require("../middleware/auth");

// Add a tip
router.post("/:milestoneId", auth, async (req, res) => {
  try {
    const { tipText } = req.body;
    const user = req.user;
    const userName = req.body.userName || "Anonymous";

    const tip = new Tip({
      milestone: req.params.milestoneId,
      userName,
      tipText,
    });

    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tips for a milestone
router.get("/:milestoneId", async (req, res) => {
  try {
    const tips = await Tip.find({ milestone: req.params.milestoneId }).sort({
      createdAt: -1,
    });
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
