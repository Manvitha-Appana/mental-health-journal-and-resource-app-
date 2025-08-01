const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Journal = require('../models/Journal');

// POST /api/journals - Add a new journal entry
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const journal = new Journal({
      user: req.user.userId,
      content,
      date: new Date()
    });
    await journal.save();
    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: "Server error while saving journal entry" });
  }
});

// GET /api/journals - Get all journal entries for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching journal entries" });
  }
});

// DELETE /api/journals/:id - Delete an entry
router.delete("/:id", auth, async (req, res) => {
  try {
    await Journal.deleteOne({ _id: req.params.id, user: req.user.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting journal entry" });
  }
});

module.exports = router;

