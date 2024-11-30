const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

const styles = [
  "Hyper-Surreal Escape",
  "Neon Fauvism",
  "Post-Analog Glitchscape",
  "AI Dystopia",
  "Vivid Pop Explosion"
];

exports.config = {
  name: 'flux',
  author: 'Clarence',
  description: 'Generates a stylized image based on a prompt using various unique styles.',
  method: 'get',
  category: 'image generation',
  link: ['/flux?prompt=&style=1']
};

exports.initialize = async function ({ req, res }) {
  const { prompt, style } = req.query;

  if (!prompt) {
    return res.status(400).json({
      error: 'Prompt parameter is required.',
      exampleUsage: "/flux?prompt=dog%20walking%20in%20the%20park&style=3"
    });
  }
  
  const index = style && style > 0 && style <= styles.length
    ? parseInt(style, 10)
    : Math.floor(Math.random() * styles.length) + 1;

  try {
    const formData = new FormData();
    formData.append("field-0", prompt);
    formData.append("field-1", styles[index - 1]);

    const response = await axios.post("https://devrel.app.n8n.cloud/form/flux", formData, {
      headers: {
        ...formData.getHeaders(),
        Accept: "/",
        "User-Agent": "Postify/1.0.0"
      }
    });

    const data = response.data;
    const $ = cheerio.load(data);
    const imageUrl = $(".image-container img").attr("src");
    const styleText = $(".style-text").text().replace("Style: ", "");

    if (imageUrl) {
      res.json({
        success: true,
        prompt,
        style: styleText || styles[index - 1],
        imageUrl
      });
    } else {
      res.status(500).json({ error: 'Failed to retrieve image URL. Please try again.' });
    }
  } catch (error) {
    console.error("Error generating image:", error.message || error);
    res.status(500).json({ error: 'An error occurred while generating the image. Please try again.' });
  }
};
