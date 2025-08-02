const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", (req, res) => {
    const devlogs = [];
    
    const sortingList = [
        { "title": undefined, "link": "" },
        { "title": "trending", "link": "" },
        { "title": "most-recent", "link": "most-recent/" },
        { "title": "most-popular", "link": "most-popular/" },
    ]
    
    const postTypeList = [
        { "title": undefined, "link": "" },
        { "title": "major-update", "link": "major-update/" },
        { "title": "postmortem", "link": "postmortems/" },
        { "title": "game-design", "link": "game-design/" },
        { "title": "tech-discussion", "link": "tech-discussion/" },
        { "title": "tutorial", "link": "tutorials/" },
        { "title": "announcement", "link": "post_type-announcement/" },
        { "title": "culture", "link": "culture/" },
        { "title": "marketing", "link": "marketing/" },
    ]
    
    const projectTypeList = [
        { "title": undefined, "link": "" },
        { "title": "games", "link": "games/" },
        { "title": "game-assets", "link": "game-assets/" },
        { "title": "physical-games", "link": "physical-games/" },
        { "title": "tools", "link": "tools/" },
        { "title": "comics", "link": "comics/" },
        { "title": "books", "link": "books/" }
    ]
    
    const sort = req.query.sort;
    const post = req.query.post;
    const project = req.query.project;
    
    const sortingObject = sortingList.find(s => s.title === sort);
    const postObject = postTypeList.find(po => po.title === post);
    const projectObject = projectTypeList.find(pr => pr.title === project);
    
    if (!sortingObject)
        return res.status(404).json({ error: "Sorting ID not found" });
    if (!postObject)
        return res.status(404).json({ error: "Platform ID not found" });
    if (!projectObject)
        return res.status(404).json({ error: "Price ID not found" });
    
    axios.get("https://www.itch.io/devlogs/" + sortingObject.link + projectObject.link + postObject.link)
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        
        $("div.blog_post").each((index, element) => {
            const name = $(element).find(".post_title a").text();
            const url = $(element).find(".post_title a  ").attr("href");
            const game = $(element).find(".game_title a").text();
            const game_url = $(element).find(".game_title a").attr("href");
            const description = $(element).find(".summary").text();
            const thumbnail = $(element).find(".image_wrapper a img").attr("data-lazy_src");
            devlogs.push({ name, url, game, game_url, description, thumbnail });
        });
        
        res.json(devlogs);
    })
    .catch((err) => {
        console.error(err);
    });
});

module.exports = router;