const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.get("/featured-jams", (req, res) => {
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

const commonSortingList = [
    { "title": undefined, "link": "" },
    { "title": "popular", "link": "" },
    { "title": "trending", "link": "new-and-popular/" },
    { "title": "top-sellers", "link": "top-sellers/" },
    { "title": "top-rated", "link": "top-rated/"},
    { "title": "newest", "link": "newest/"},
    { "title": "has-demo", "link": "has-demo" }
]
const commonTagList = [
  { "title": undefined, "link": "" },
  { "title": "action", "link": "tag-action/" },
  { "title": "adventure", "link": "tag-adventure/" },
  { "title": "card-game", "link": "tag-card-game/" },
  { "title": "educational", "link": "tag-educational/" },
  { "title": "fighting", "link": "tag-fighting/" },
  { "title": "interactive-fiction", "link": "tag-interactive-fiction/" },
  { "title": "platformer", "link": "tag-platformer/" },
  { "title": "puzzle", "link": "tag-puzzle/" },
  { "title": "racing", "link": "tag-racing/" },
  { "title": "rhythm", "link": "tag-rhythm/" },
  { "title": "role-playing", "link": "tag-role-playing/" },
  { "title": "shooter", "link": "tag-shooter/" },
  { "title": "simulation", "link": "tag-simulation/" },
  { "title": "sports", "link": "tag-sports/" },
  { "title": "strategy", "link": "tag-strategy/" },
  { "title": "survival", "link": "tag-survival/" },
  { "title": "visual-novel", "link": "tag-visual-novel/" },
  { "title": "other", "link": "tag-other/" }
]
const commonPriceList = [
    { "title": undefined, "link": "" },
    { "title": "sale", "link": "on-sale/" },
    { "title": "price", "link": "store/"},
    { "title": "free", "link": "free/" },
    { "title": "less-than-5", "link": "5-dollars-or-less" },
    { "title": "less-than-15", "link": "15-dollars-or-less" },
]
const commonTimeList = [
    { "title": undefined, "link": "" },
    { "title": "last-day", "link": "last-day/" },
    { "title": "last-week", "link": "last-7-days/"},
    { "title": "last-month", "link": "last-30-days/"},
]
const commonPlatformList = [
    { "title": undefined, "link": "" },
    { "title": "windows", "link": "platform-windows/" },
    { "title": "macos", "link": "platform-macos/" },
    { "title": "linux", "link": "platform-linux/" },
    { "title": "android", "link": "platform-android/"},
    { "title": "ios", "link": "platform-ios/"},
    { "title": "browser", "link": "platform-browser/" }
]
const commonSelectors = {
    container: ".game_cell_data",
    title: ".game_title .title",
    price: ".game_title .price_value",
    url: ".game_title a",
    description: ".game_text",
    author: ".game_author a"
}

const categoryUrls = {
    games: "https://www.itch.io/games/",
    tools: "https://www.itch.io/tools/",
    assets: "https://www.itch.io/game-assets/",
    comics: "https://www.itch.io/comics/",
    books: "https://www.itch.io/books/",
    physics_games: "https://itch.io/physical-games",
    soundtracks: "https://itch.io/soundtracks",
    mods: "https://itch.io/game-mods",
    misc: "https://itch.io/misc/"
}

const createScraperRoute = (baseUrl, sortingList, priceList, platformList, timeList, tagList, selectors) => {
    return async (req, res) => {
        try {
            const sort = req.query.sort;
            const platform = req.query.platform;
            const price = req.query.price;
            const time = req.query.time;
            const genre = req.query.genre;

            const sortingObject = sortingList.find(s => s.title === sort);
            const platformObject = platformList.find(p => p.title === platform);
            const priceObject = priceList.find(p => p.title === price);
            const timeObject = timeList.find(t => t.title === time);
            const tagObject = tagList.find(g => g.title === genre);

            if (!sortingObject)
                return res.status(404).json({ error: "Sorting ID not found" });
            if (!platformObject)
                return res.status(404).json({ error: "Platform ID not found" });
            if (!priceObject)
                return res.status(404).json({ error: "Price ID not found" });
            if (!timeObject)
                return res.status(404).json({ error: "Time ID not found" });
            if (!tagObject)
                return res.status(404).json({ error: "Tag ID not found" });

            const fullUrl = baseUrl + sortingObject.link + platformObject.link + priceObject.link + timeObject.link + tagObject.link;
            const response = await axios.get(fullUrl);
            const html = response.data;
            const $ = cheerio.load(html);

            const results = [];
            $(selectors.container).each((index, element) => {
                const name = $(element).find(selectors.title).text();
                const price = $(element).find(selectors.price).text();
                const url = $(element).find(selectors.url).attr("href");
                const description = $(element).find(selectors.description).text();
                const author = $(element).find(selectors.author).text();
                
                results.push({ name, price, url, description, author });
            });

            res.json(results);
        } catch (err) {
            console.error(`Error scraping ${baseUrl}:`, err);
            res.status(500).json({ error: "Failed to scrape data." });
        }
    };
};

for (const category in categoryUrls) {
    const baseUrl = categoryUrls[category];
    const routePath = `/search/${category}/`;
    
    // Create the handler for this specific category
    const routeHandler = createScraperRoute(baseUrl, commonSortingList, commonPriceList, commonPlatformList, commonTimeList, commonTagList, commonSelectors);
    
    // Register the route with Express
    app.get(routePath, routeHandler);
}

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

