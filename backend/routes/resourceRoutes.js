const express = require("express");
const router = express.Router();

// Static list of mental health resources
const resources = [
    {
        category: "Anxiety",
        title: "10 Tips to Cope with Anxiety",
        link: "https://www.verywellmind.com/top-ways-to-reduce-anxiety-2584181"
    },
    {
        category: "Depression",
        title: "Understanding Depression",
        link: "https://www.nimh.nih.gov/health/topics/depression"
    },
    {
        category: "Meditation",
        title: "Guided Meditation for Beginners",
        link: "https://www.youtube.com/watch?v=inpok4MKVLM"
    },
    {
        category: "Emergency",
        title: "Helpline India",
        link: "https://www.aasra.info/helpline.html"
    }
];

router.get("/", (req, res) => {
    res.json(resources);
});

module.exports = router;
