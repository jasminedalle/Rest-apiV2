const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.config = {
    name: "half-illustration",
    author: "Clarence",
    description: "Generate a half illustration based on the provided text.",
    method: 'get',
    category: "image generation",
    link: "/half-illustration?prompt=A grave",
};

async function generateIllustration(prompt) {
    const url = "https://api-inference.huggingface.co/models/davisbro/half_illustration";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        "Referer": `https://huggingface.co/davisbro/half_illustration?text=${encodeURIComponent(prompt)}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, { inputs: prompt }, {
            headers,
            responseType: 'arraybuffer'
        });

        if (response.status === 200) {
            return Buffer.from(response.data);
        } else {
            console.error(`Request failed with status ${response.status}: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Error generating illustration:", error.message);
        return null;
    }
}

exports.initialize = async function ({ req, res }) {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'The "prompt" parameter is required.' });
    }

    const tempDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const illustrationBuffer = await generateIllustration(prompt);
    if (illustrationBuffer) {
        const filePath = path.join(tempDir, "hf.png");
        
        try {
            fs.writeFileSync(filePath, illustrationBuffer);

            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                }
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
                });
            });
        } catch (fileError) {
            console.error("Error handling file:", fileError);
            return res.status(500).json({ error: "Failed to process generated image." });
        }
    } else {
        return res.status(500).json({ error: "Failed to generate image." });
    }
};
