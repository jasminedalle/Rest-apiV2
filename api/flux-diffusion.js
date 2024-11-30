const axios = require('axios');

exports.config = {
    name: "Flux-Diffusion",
    author: "Clarence",
    description: "Fetch AI-generated image using Flux Diffusion.",
    method: 'get',
    category: "image generation",
    link: ["/Flux-Diffusion?prompt="]
};

async function fetchFluxImage(prompt) {
    const url = global.config.ryzenapi + 'ai/flux-diffusion';

    try {
        const response = await axios.get(url, {
            params: { prompt },
            responseType: 'arraybuffer'
        });

        if (response.status === 200) {
            const imageBuffer = Buffer.from(response.data, 'binary');
            return imageBuffer;
        } else {
            console.error(`Request failed with status ${response.status}: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching Flux Diffusion image:", error.message);
        return null;
    }
}

exports.initialize = async function ({ req, res }) {
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({ error: 'The "prompt" parameter is required.' });
    }

    const imageData = await fetchFluxImage(prompt);

    if (imageData) {
        res.setHeader('Content-Type', 'image/jpeg');
        return res.status(200).send(imageData);
    } else {
        return res.status(500).json({ error: "Failed to fetch image from Flux Diffusion API." });
    }
};
