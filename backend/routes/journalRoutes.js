const express = require('express');
const router = express.Router();
const auth = require('./authMiddleware');

router.delete("/:id", auth, async (req, res) => {
    await Journal.deleteOne({ _id: req.params.id, user: req.user.userId });
    res.json({ message: "Deleted" });
});

module.exports = router;
