const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: __dirname + "/.env" });
console.log("MONGO_URI:", process.env.MONGO_URI); 
const journalRoutes = require('./routes/journalRoutes');
const authRoutes = require("./routes/authRoutes");
const moodRoutes = require("./routes/moodRoutes");
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes (we’ll create these soon)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/journals", require("./routes/journalRoutes"));
app.use("/api/mood", require("./routes/moodRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use('/api/contact', contactRoutes);

app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Fallback route - show login.html by default
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend", "login.html"));
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
