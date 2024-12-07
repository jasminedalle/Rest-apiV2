const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Your API key
const API_KEY = "AIzaSyBLVEk7Q42t1InrV5gsifxKfH-1ZAf8Ln8";

const conversationHistories = {};

app.get("/api/gemini-vision", async (req, res) => {
    const { q, uid = "default", imageUrl } = req.query;

    if (!q && !imageUrl) {
        return res.status(400).json({ error: "Please provide a question or image URL for analysis." });
    }

    // Handle clearing conversation history
    if (["clear", "reset", "forgot", "forget"].includes(q?.toLowerCase())) {
        conversationHistories[uid] = [];
        return res.json({ message: "Conversation history cleared." });
    }

    // Initialize conversation history
    const history = conversationHistories[uid] || [];
    if (q) {
        history.push({ senderType: "USER", content: q });
    }
    conversationHistories[uid] = history;

    try {
        let responseText = "";

        // Handle text-based questions
        if (q) {
            const aiResponse = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    model: "text-davinci-003",
                    prompt: history.map((msg) => msg.content).join("\n") + `\nAI:`,
                    max_tokens: 150,
                },
                { headers: { Authorization: `Bearer ${API_KEY}` } }
            );

            responseText = aiResponse.data.choices[0].text.trim();
            history.push({ senderType: "BOT", content: responseText });
        }

        // Handle image analysis
        let imageAnalysisResult = "";
        if (imageUrl) {
            const visionApiResponse = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
                {
                    requests: [
                        {
                            image: { source: { imageUri: imageUrl } },
                            features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
                        },
                    ],
                }
            );

            const labels = visionApiResponse.data.responses[0]?.labelAnnotations?.map((label) => label.description) || [];
            imageAnalysisResult = `Image analysis results: ${labels.join(", ")}`;
            history.push({ senderType: "BOT", content: imageAnalysisResult });
        }

        res.json({
            message: `${responseText}\n${imageAnalysisResult}`.trim(),
            conversationHistory: history,
        });
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

app.listen(port, () => {
    console.log(`Gemini API is running on port ${port}`);
});
