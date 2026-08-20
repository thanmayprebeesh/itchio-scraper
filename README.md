# itch.io REST API

A lightweight REST API for scraping and retrieving structured data from [itch.io](https://itch.io).

This API provides access to itch.io games, projects, creators, devlogs, game jams, and detailed project information without requiring direct HTML parsing on the client side.

> **Note:** This API relies on scraping publicly available itch.io pages. Changes to itch.io's HTML structure may cause endpoints to stop working.

---

## Features

* 🎮 Browse itch.io games and other project categories
* 🔎 Filter projects by:

  * Sorting
  * Platform
  * Price
  * Time period
  * Genre
* 👤 Retrieve creator profiles and their projects
* 📦 Retrieve detailed information about individual projects
* 📝 Browse itch.io devlogs
* 🏆 Retrieve featured game jams
* 🖼️ Retrieve thumbnails and screenshots
* ⚡ JSON responses
* 🛠️ Built with Node.js and Express

---

## Tech Stack

* **Node.js**
* **Express.js**
* **Axios** — HTTP requests
* **Cheerio** — HTML parsing / scraping

---

# Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

For development with nodemon:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

# API Endpoints

## 1. Get Creator Profile

Retrieve information about an itch.io creator and their published projects.

### Endpoint

```http
GET /creator?name={creator}
```

### Parameters

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `name`    | string | Yes      | itch.io creator username |

### Example

```http
GET /creator?name=example
```

### Response

```json
{
  "name": "Example",
  "url": "https://example.itch.io/",
  "bio": "Creator description",
  "banner": "https://example.itch.io/banner.png",
  "projects": [
    {
      "name": "My Game",
      "price": "5",
      "url": "https://example.itch.io/my-game",
      "description": "A game description",
      "thumbnail": "https://example.itch.io/thumbnail.png",
      "platforms": [
        "Windows",
        "Linux"
      ]
    }
  ]
}
```

---

# 2. Browse Projects

The API supports several itch.io project categories.

### Available Categories

| Endpoint          | Category       |
| ----------------- | -------------- |
| `/games/`         | Games          |
| `/tools/`         | Tools          |
| `/assets/`        | Game Assets    |
| `/comics/`        | Comics         |
| `/books/`         | Books          |
| `/physics_games/` | Physical Games |
| `/soundtracks/`   | Soundtracks    |
| `/mods/`          | Game Mods      |
| `/misc/`          | Miscellaneous  |

### Example

```http
GET /games/
```

---

## Filtering

Project endpoints support multiple query parameters that can be combined.

```http
GET /games/?sort=trending&platform=windows&price=free&genre=action
```

### Sorting

| Value         | Description      |
| ------------- | ---------------- |
| `popular`     | Popular          |
| `trending`    | Trending         |
| `top-sellers` | Top sellers      |
| `top-rated`   | Top rated        |
| `newest`      | Newest           |
| `has-demo`    | Games with demos |

### Platforms

| Value     |
| --------- |
| `windows` |
| `macos`   |
| `linux`   |
| `android` |
| `ios`     |
| `browser` |

### Price

| Value          | Description       |
| -------------- | ----------------- |
| `sale`         | Currently on sale |
| `price`        | Paid projects     |
| `free`         | Free projects     |
| `less-than-5`  | $5 or less        |
| `less-than-15` | $15 or less       |

### Time

| Value        | Description                          |
| ------------ | ------------------------------------ |
| `last-day`   | Released/updated in the last day     |
| `last-week`  | Released/updated in the last 7 days  |
| `last-month` | Released/updated in the last 30 days |

### Genre

| Value                 |
| --------------------- |
| `action`              |
| `adventure`           |
| `card-game`           |
| `educational`         |
| `fighting`            |
| `interactive-fiction` |
| `platformer`          |
| `puzzle`              |
| `racing`              |
| `rhythm`              |
| `role-playing`        |
| `shooter`             |
| `simulation`          |
| `sports`              |
| `strategy`            |
| `survival`            |
| `visual-novel`        |
| `other`               |

### Example Requests

Get the newest free Windows games:

```http
GET /games/?sort=newest&platform=windows&price=free
```

Get trending action games:

```http
GET /games/?sort=trending&genre=action
```

Get games released in the last week:

```http
GET /games/?time=last-week
```

All filters can be combined:

```http
GET /games/?sort=top-rated&platform=linux&price=less-than-15&time=last-month&genre=rpg
```

---

# 3. Get Project Details

Retrieve detailed information about a specific itch.io project.

### Endpoint

```http
GET /project?creator={creator}&name={project}
```

### Parameters

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `creator` | string | Yes      | itch.io creator username |
| `name`    | string | Yes      | Project slug             |

### Example

```http
GET /project?creator=example&name=my-game
```

### Response

```json
{
  "title": "My Game",
  "author": {
    "name": "Example",
    "url": "https://example.itch.io/"
  },
  "slug": "my-game",
  "price": "5",
  "url": "https://example.itch.io/my-game",
  "tags": [
    "horror",
    "indie"
  ],
  "genres": [
    "Action"
  ],
  "ratings": {
    "average": "4.5",
    "count": "120"
  },
  "platforms": [
    "Windows",
    "Linux"
  ],
  "dates": {
    "last_update": "2026-08-01",
    "release_date": "2026-06-15"
  },
  "description": "Game description...",
  "screenshots": [
    "https://example.itch.io/screenshot1.png"
  ]
}
```

---

# 4. Devlogs

Retrieve itch.io devlog posts.

### Endpoint

```http
GET /devlogs/
```

### Query Parameters

#### Sorting

| Value          | Description      |
| -------------- | ---------------- |
| `trending`     | Trending devlogs |
| `most-recent`  | Most recent      |
| `most-popular` | Most popular     |

#### Post Type

| Value             |
| ----------------- |
| `major-update`    |
| `postmortem`      |
| `game-design`     |
| `tech-discussion` |
| `tutorial`        |
| `announcement`    |
| `culture`         |
| `marketing`       |

#### Project Type

| Value            |
| ---------------- |
| `games`          |
| `game-assets`    |
| `physical-games` |
| `tools`          |
| `comics`         |
| `books`          |

### Example

```http
GET /devlogs/?sort=most-recent&post=major-update&project=games
```

### Response

```json
[
  {
    "name": "Major Update",
    "url": "https://itch.io/devlog/...",
    "game": "My Game",
    "game_url": "https://example.itch.io/my-game",
    "description": "What's new in this update...",
    "thumbnail": "https://..."
  }
]
```

---

# 5. Featured Game Jams

Retrieve currently featured game jams on itch.io.

### Endpoint

```http
GET /featured-jams
```

### Response

```json
[
  {
    "jamName": "My Game Jam",
    "jamUrl": "https://itch.io/jam/my-game-jam"
  }
]
```

---

# Response Format

The API returns JSON.

Project listings generally contain:

```json
{
  "name": "Game Name",
  "price": "Free",
  "url": "https://example.itch.io/game",
  "description": "Game description",
  "author": "Developer",
  "author_url": "https://example.itch.io/",
  "thumbnail": "https://...",
  "platforms": [
    "Windows",
    "Linux"
  ]
}
```

Individual project endpoints provide additional information such as:

* Tags
* Genres
* Ratings
* Release date
* Last update
* Screenshots
* Author information
* Supported platforms

---

# Error Handling

Invalid filter values return a `404` response.

Example:

```json
{
  "error": "Platform ID not found"
}
```

Scraping failures return:

```json
{
  "error": "Failed to scrape data."
}
```

---

# Example Usage

### JavaScript

```javascript
const response = await fetch(
  "http://localhost:3000/games/?sort=trending&platform=windows"
);

const games = await response.json();

console.log(games);
```

### Python

```python
import requests

url = "http://localhost:3000/games/"

params = {
    "sort": "trending",
    "platform": "windows",
    "price": "free"
}

response = requests.get(url, params=params)

games = response.json()

print(games)
```

### cURL

```bash
curl "http://localhost:3000/games/?sort=trending&platform=windows&price=free"
```

---

# Project Structure

```text
.
├── routes/
│   ├── creators.js
│   ├── projects.js
│   ├── devlogs.js
│   ├── jams.js
│   └── ...
├── server.js
├── package.json
└── README.md
```

---

# Disclaimer

This project is an **unofficial third-party API** and is not affiliated with, endorsed by, or sponsored by itch.io.

The API retrieves information from publicly accessible itch.io pages. Use it responsibly and respect itch.io's terms of service, robots.txt, rate limits, and server resources.

Because this project depends on web scraping, changes to itch.io's website structure may cause individual endpoints or fields to stop functioning.

---

## Contributing

Contributions, bug reports, and feature requests are welcome.

If you find an endpoint that has stopped working due to changes on itch.io, feel free to open an issue or submit a pull request.

---

Made with ❤️ using Node.js, Express, Axios and Cheerio.
