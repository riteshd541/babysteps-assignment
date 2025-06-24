const express = require("express");
const router = express.Router();
const Milestone = require("../models/Milestone");
const auth = require("../middleware/auth");

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { title, date, notes } = req.body;
    const milestone = new Milestone({ user: req.user, title, date, notes });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Get all user's milestones
// router.get("/", auth, async (req, res) => {
//   try {
//     const milestones = await Milestone.find({ user: req.user }).sort({
//       date: 1,
//     });
//     res.json(milestones);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// Get ALL milestones (for community access)
router.get("/", async (req, res) => {
  try {
    const milestones = await Milestone.find().sort({ date: 1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Milestone.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ message: "Milestone deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
