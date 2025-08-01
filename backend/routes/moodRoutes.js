const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Mood = require("../models/Mood");

// Get all mood entries for logged-in user
router.get("/", auth, async (req, res) => {
    const moods = await Mood.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(moods);
});

// Add new mood
router.post("/", auth, async (req, res) => {
    const mood = new Mood({
        user: req.user.userId,
        mood: req.body.mood
    });
    await mood.save();
    res.json(mood);
});

module.exports = router;
