const axios = require("axios");
const cheerio = require("cheerio");

exports.config = {
  name: 'news',
  author: 'Clarence',
  description: 'Fetches news articles from Google News',
  method: 'get',
  category: 'others',
  link: ['/news']
};

exports.initialize = async function ({ req, res }) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const url = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN%3Aen`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);
    const articles = [];

    $("c-wiz div main div c-wiz c-wiz c-wiz article").each((_, el) => {
      const title = $(el).find("h3").text().trim();
      const time = $(el).find("time").text().trim();
      const date = $(el).find("time").attr("datetime");
      const author = $(el).find("span").first().text().trim() || "Anonymous";

      const imgAttr = $(el).find("figure img").last().attr("srcset");
      const img = imgAttr ? imgAttr.split(" ")[0] : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";

      const link = "https://news.google.com" + $(el).find("a").attr("href").slice(1);
      const source = $(el).find(".wEwyrc").text().trim() || "Unknown Source";

      articles.push({
        title,
        time,
        date,
        author,
        imageUrl: img,
        link,
        source,
      });
    });

    const structuredData = {
      status: articles.length ? "success" : "no results",
      totalResults: articles.length,
      articles,
    };

    res.json(structuredData);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
