const PORT = 8000;
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json("Welcome to Itch.io Scraper");
});

app.use('/jams', require("./routes/jam"));
app.use('/game', require("./routes/game"));
app.use('/author', require("./routes/author"));
app.use('/devlogs', require("./routes/devlogs"));
app.use('/browse', require("./routes/browse"));
app.use('/featured-jams', require("./routes/featured-jams"))

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

