const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

exports.config = {
    name: 'billboard',
    author: 'Clarence',
    description: 'Generate a billboard image with custom text',
    method: 'get',
    category: 'canvas',
    link: ['/billboard?text=Your%20message%20here']
};

exports.initialize = async function ({ req, res }) {
    try {
        const { text } = req.query;

        if (!text) {
            return res.status(400).json({
                error: "Missing 'text' parameter",
                message: "Please provide the 'text' parameter as: ?text=Your%20message"
            });
        }

        const cacheDir = path.join(__dirname, 'tmp');
        await fs.ensureDir(cacheDir);

        const imageUrl = "https://i.imgur.com/U4WgPjQ.jpeg";
        const outputPath = path.join(cacheDir, 'billboard.png');

        const img = await loadImage(imageUrl);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        ctx.font = '48px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = img.width / 2;
        const y = img.height / 2;
        ctx.fillText(text, x, y);

        const imageBuffer = canvas.toBuffer();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', imageBuffer.length);

        res.end(imageBuffer);

        await fs.unlink(outputPath);
    } catch (error) {
        console.error("Error generating billboard image:", error);
        res.status(500).json({ error: "Failed to generate billboard image" });
    }
};
