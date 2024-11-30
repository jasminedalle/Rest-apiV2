const axios = require('axios');

exports.config = {
    name: "SD3.5",
    author: "Clarence",
    description: "Generate an image using the Stable Diffusion model.",
    method: 'get',
    category: "image generation",
    link: ["/SD3.5?prompt="]
};

async function generateImage(prompt) {
    const url = 'https://api-inference.huggingface.co/models/prithivMLmods/SD3.5-Large-Photorealistic-LoRA';
    const token = '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';

    try {
        const response = await axios.post(
            url,
            { inputs: prompt },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer',
            }
        );

        if (response.status === 200) {
            const imageBuffer = Buffer.from(response.data, 'binary');
            return imageBuffer;
        } else {
            console.error(`Request failed with status ${response.status}: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Error generating image:", error.message);
        return null;
    }
}

exports.initialize = async function ({ req, res }) {
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({ error: 'The "prompt" parameter is required.' });
    }

    const imageData = await generateImage(prompt);

    if (imageData) {
        res.setHeader('Content-Type', 'image/jpeg'); 
        return res.status(200).send(imageData);
    } else {
        return res.status(500).json({ error: "Failed to generate image from API." });
    }
};
