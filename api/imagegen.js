const axios = require('axios');

exports.config = {
  name: 'imagegen',
  author: 'Clarence',
  description: 'Generate an AI image using the provided prompt.',
  method: 'get',
  category: 'image generation',
  link: ['/imagegen?prompt=&aspect_ratio=16:9']
};

exports.initialize = async function ({ req, res }) {
  const { prompt, aspect_ratio = "16:9", link = "writecream.com" } = req.query;

  if (!prompt) {
    return res.status(400).json({
      error: "Missing required parameter",
      message: "Please provide the 'prompt' parameter to generate an image.",
      exampleUsage: "/imagegen?prompt=landscape&aspect_ratio=21:9"
    });
  }

  try {
    const apiUrl = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image`;
    const response = await axios.get(apiUrl, {
      params: {
        prompt,
        aspect_ratio,
        link
      }
    });

    const { image_link, base64_output, status, attempt } = response.data;

    if (status === "success" && image_link) {
      return res.status(200).json({
        success: true,
        message: "AI image generated successfully.",
        image_link,
        base64_output,
        attempt
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Image generation failed.",
        message: "The AI image generation API returned a failure status.",
        status,
        attempt
      });
    }
  } catch (error) {
    console.error("Error generating AI image:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while generating the AI image. Please try again later."
    });
  }
};
