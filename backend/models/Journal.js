const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Journal", JournalSchema);
