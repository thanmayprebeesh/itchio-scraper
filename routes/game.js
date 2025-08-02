const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get('/', (req, res) => {
    const { creator, name } = req.query;
    const baseUrl = `https://${creator}.itch.io/${name}`;

    axios.get(baseUrl)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.inner_column").each((index, element) => {
                const title = $(element).find(".game_title").text();
                const author = {
                    "name": $(element).find(".game_info_panel_widget table tbody tr:contains('Author') td:nth-child(2)").text(),
                    "url": $(element).find(".game_info_panel_widget table tbody tr:contains('Author') td:nth-child(2) a").attr("href")
                };

                const slug = name;
                var price = $(element).find("[itemprop='price']").text();
                if(price != ""){
                    price = price.split(" ")[0];
                }
                else{
                    price = "Free";
                }
                    
                const url = baseUrl;

                const tags = [];
                $(element).find(".game_info_panel_widget table tbody tr:contains('Tags') td:nth-child(2) a")
                    .each((index, element) => {
                        const text = $(element).text().trim();
                        tags.push(text);
                    })
                    
                const genres = [];
                $(element).find(".game_info_panel_widget table tbody tr:contains('Genre') td:nth-child(2) a")
                    .each((index, element) => {
                        const text = $(element).text().trim();
                        genres.push(text);
                    })
                const description = $(element).find(".formatted_description").text();
                const dates = {
                    "last_update": $(element).find(".game_info_panel_widget table tbody tr:contains('Updated') td:nth-child(2) abbr").attr("title"),
                    "release_date": $(element).find(".game_info_panel_widget table tbody tr:contains('Release date') td:nth-child(2) abbr").attr("title")
                }
                const ratings = { 
                    "average": $(element).find(".aggregate_rating").attr("title"),
                    "count": $(element).find(".rating_count").attr("content")
                }

                const platforms = [];
                $(element).find(".game_info_panel_widget table tbody tr:contains('Platforms') td:nth-child(2) a")
                    .each((index, element) => {
                        const text = $(element).text().trim();
                        platforms.push(text);
                    })

                const screenshots = [];
                $(element).find(".screenshot_list a")
                    .each((index, element) => {
                        const text = $(element).attr("href").trim();
                        screenshots.push(text);
                    })
                res.json({ title, author, slug, price, url, tags, genres, ratings , platforms, dates, description, screenshots });
            });      
        })
        .catch((err) => {
            console.error(`Error scraping ${baseUrl}:`, err);
            res.status(500).json({ error: "Failed to scrape data." });
        }); 
});

module.exports = router;