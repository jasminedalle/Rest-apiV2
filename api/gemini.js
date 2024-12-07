const axios = require("axios");

exports.config = {
    name: "gemini",
    version: "1.0.0",
    author: "French Clarence Mangigo",
    description: "Interact with Gemini for text and image analysis.",
    method: "post",
    link: [
        "/api/gemini-vision?q=&uid=&imageUrl="
    ],
    guide: "q=your_question&uid=your_user_id&imageUrl=image_url",
    category: "ai"
};

// Store conversation history per user
const conversationHistories = {};

exports.initialize = async ({ req, res }) => {
    const { q, uid, imageUrl } = req.query;

    if (!uid) {
        return res.status(400).json({ error: "User ID (uid) is required." });
    }

    if (!q && !imageUrl) {
        return res.status(400).json({ error: "Either 'q' or 'imageUrl' must be provided." });
    }

    // Clear history
    if (q?.toLowerCase() === "clear") {
        conversationHistories[uid] = [];
        return res.json({ message: "Conversation history cleared." });
    }

    // Initialize conversation history for this user
    if (!conversationHistories[uid]) {
        conversationHistories[uid] = [];
    }
    const history = conversationHistories[uid];

    const apiKey = "AIzaSyBLVEk7Q42t1InrV5gsifxKfH-1ZAf8Ln8";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        const prompt = q ? { text: q } : { text: `Analyze this image: ${imageUrl}` };
        const payload = {
            contents: [
                {
                    parts: [prompt]
                }
            ]
        };

        // Send the API request to Gemini
        const response = await axios.post(apiUrl, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Parse the response
        const geminiResponse = response.data?.contents?.[0]?.parts?.[0]?.text || "No response from Gemini API.";

        // Save the user and bot interactions to history
        history.push({ senderType: "USER", content: q || imageUrl });
        history.push({ senderType: "BOT", content: geminiResponse });

        res.json({
            message: geminiResponse,
            history,
            author: exports.config.author
        });
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to process the request. Please try again." });
    }
};
