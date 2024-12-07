const axios = require('axios');
const fs = require('fs');
const path = require('path');

const chatHistoryDir = 'nemotronChatHistory';
const apiKey = `${global.config.apikey}`;

const systemPrompt = "Respond clearly and concisely. Provide detailed responses only when requested.";

exports.config = {
    name: 'NVIDIA-Nemotron',
    author: 'Clarence',
    method: 'get',
    category: 'ai',
    description: 'Conversational AI using Nemotron model. (Conversational)',
    link: ['/NVIDIA-Nemotron?q=hi&id=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.q || '';
        const userId = req.query.id;

        // Check for missing userId
        if (!userId) {
            return res.status(400).json({ error: "Missing required parameter: id" });
        }

        // Clear chat history if requested
        if (prompt.toLowerCase() === 'clear') {
            clearChatHistory(userId);
            return res.json({ message: "Chat history cleared!" });
        }

        // Check if prompt is empty
        if (!prompt) {
            return res.status(400).json({ error: "Please provide a prompt." });
        }

        // Load chat history
        const chatHistory = loadChatHistory(userId);
        const chatMessages = [
            { role: 'system', content: systemPrompt },
            ...chatHistory,
            { role: 'user', content: prompt }
        ];

        // Create payload for the API request
        const payload = {
            model: 'nvidia/Nemotron-4-340B-Instruct',
            messages: chatMessages
        };

        // Make POST request to the API
        const { data } = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if response format is valid
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        // Extract the assistant's response
        const assistantResponse = data.choices[0].message.content;

        // Append the interaction to the chat history
        appendToChatHistory(userId, [
            { role: 'user', content: prompt },
            { role: 'assistant', content: assistantResponse }
        ]);

        // Send the response back to the client
        res.json({
            status: true, 
            result: assistantResponse,
            author: 'AceGerome'
        });
    } catch (error) {
        // Log detailed error information for debugging
        console.error("Error in chat completion:", error.response ? error.response.data : error.message);
        res.status(500).json({
            status: false,
            error: 'An error occurred while processing your request. Check the logs for details.',
            author: 'AceGerome'
        });
    }
};

// Function to load chat history from a file
function loadChatHistory(uid) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (fs.existsSync(chatHistoryFile)) {
            const fileData = fs.readFileSync(chatHistoryFile, 'utf8');
            return JSON.parse(fileData);
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error loading chat history for UID ${uid}:`, error);
        return [];
    }
}

// Function to append new interactions to the chat history file
function appendToChatHistory(uid, chatHistory) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (!fs.existsSync(chatHistoryDir)) {
            fs.mkdirSync(chatHistoryDir);
        }
        const existingHistory = loadChatHistory(uid);
        const updatedHistory = [...existingHistory, ...chatHistory];
        fs.writeFileSync(chatHistoryFile, JSON.stringify(updatedHistory, null, 2));
    } catch (error) {
        console.error(`Error saving chat history for UID ${uid}:`, error);
    }
}

// Function to clear the chat history file
function clearChatHistory(uid) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (fs.existsSync(chatHistoryFile)) {
            fs.unlinkSync(chatHistoryFile);
        }
    } catch (err) {
        console.error("Error deleting chat history file:", err);
    }
}
