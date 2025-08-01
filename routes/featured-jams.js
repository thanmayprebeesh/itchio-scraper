const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/featured-jams", (req, res) => {
    const featuredJams = [];

    axios.get("https://www.itch.io/jams")
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.primary_info h3 div a").each((index, element) => {
                const jamName = $(element).text();
                const jamUrl = "https://www.itch.io" + $(element).attr("href");
                featuredJams.push({ jamName, jamUrl });
            });

            res.json(featuredJams);
        })
        .catch((err) => {
            console.error(err);
        });
});

module.exports = router;