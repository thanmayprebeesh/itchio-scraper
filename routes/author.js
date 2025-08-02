const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get('/', (req, res) => {
    const name = req.query.name;
    const baseUrl = `https://${name}.itch.io/`;

    axios.get(baseUrl)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.user_page").each((index, element) => {
                const name = $(element).find(".text_header h1").text();
                const url = baseUrl;
                const bio =  $(element).find(".user_profile p").text();
                const banner = $(element).find(".profile_banner").attr("src");

                const projects = [];
                 $(element).find(".game_cell")
                    .each((index, element) => {
                        const name = $(element).find(".game_title .title").text();
                        const price = $(element).find(".game_title .price_value").text();
                        const url = $(element).find(".game_title a").attr("href");
                        const description = $(element).find(".game_text").text();
                        const thumbnail = $(element).find(".thumb_link img").attr("data-lazy_src");

                        const platforms = [];
                        $(element).find(".game_platform span")
                            .each((index, element) => {
                                const text = $(element).attr("title");
                                if(text != null)
                                    platforms.push(text.split(" ").pop());

                                const browser_text = $(element).text();
                                if(browser_text != ""){
                                    const resultString = browser_text.split(" ").pop();
                                    platforms.push(`${resultString.charAt(0).toUpperCase()}${resultString.slice(1)}`);

                                }
                            })

                        projects.push({ name, price, url, description, thumbnail, platforms });
                    })

                res.json({ name, url, bio, banner, projects });
            });      
        })
        .catch((err) => {
            console.error(`Error scraping ${baseUrl}:`, err);
            res.status(500).json({ error: "Failed to scrape data." });
        }); 
});

module.exports = router;