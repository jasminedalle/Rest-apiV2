const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

exports.config = {
    name: "gpt4o1",
    version: "1.2.0",
    author: "CLARENCE",
    description: "Proxy prompts to the AI tutor chat API with per-UID state.",
    method: "get",
    link: ["/gpt4o1?prompt=&uid=${Date.now()}"],
    guide: "GET /gpt4o1?prompt=QUESTION&uid=UNIQUE_USER_ID",
    category: "ai",
    credits: "CLARENCE"
};

const BASE_URL = "https://aitutor-38965.chipp.ai";
const CHAT_ENDPOINT = `${BASE_URL}/api/chat`;
const APP_NAME_ID = "AItutor-38965";
const REFERER = `${BASE_URL}/w/chat/${APP_NAME_ID}`;
const COOKIE = process.env.AITUTOR_COOKIE || ""; // set to your session cookie

const TEMPLATE_PATH = path.resolve(__dirname, "../session_message_flow.json");
const conversations = new Map();
const templatePayload = loadTemplatePayload(TEMPLATE_PATH);
const defaultReply = extractAssistantReply(templatePayload) || "Mock assistant response";

const sanitizeHeader = (value) => Buffer.from(value, "utf8").toString("latin1");

function loadTemplatePayload(filePath) {
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(raw);
        const requests = Array.isArray(data.requests) ? data.requests : [];
        for (let i = requests.length - 1; i >= 0; i -= 1) {
            const req = requests[i];
            if (req && typeof req === "object" && String(req.url || "").endsWith("/api/chat")) {
                const payload = req.post_data || req.postData || req.body;
                if (typeof payload === "string") {
                    return JSON.parse(payload);
                }
            }
        }
    } catch (error) {
        // ignore missing/invalid template
    }
    return null;
}

function extractAssistantReply(payload) {
    if (!payload || !Array.isArray(payload.messages)) return null;
    for (let i = payload.messages.length - 1; i >= 0; i -= 1) {
        const message = payload.messages[i];
        if (!message || message.role !== "assistant") continue;
        if (Array.isArray(message.parts)) {
            for (const part of message.parts) {
                if (part && typeof part.text === "string" && part.text.trim()) {
                    return part.text.trim();
                }
            }
        }
        if (typeof message.content === "string" && message.content.trim()) {
            return message.content.trim();
        }
    }
    return null;
}

function seedConversation(uid) {
    if (!conversations.has(uid)) {
        const preserved = [];
        if (templatePayload && Array.isArray(templatePayload.messages)) {
            for (const message of templatePayload.messages) {
                if (message && message.role !== "user") {
                    preserved.push(structuredClone(message));
                }
            }
        }
        conversations.set(uid, preserved);
    }
    return conversations.get(uid);
}

function structuredClone(obj) {
    return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

function createTextMessage(role, text) {
    return {
        role,
        content: text,
        parts: [{ type: "text", text }]
    };
}

function buildPayload(conversation, overrideSessionId) {
    const template = structuredClone(templatePayload) || {};
    template.messages = conversation.map(structuredClone);
    template.id = crypto.randomBytes(8).toString("hex");
    const sessionId = overrideSessionId || (templatePayload && templatePayload.chatSessionId);
    if (sessionId) template.chatSessionId = sessionId;
    return template;
}

function parseStreamingBody(body) {
    const chunks = [];
    for (const line of body.split(/\r?\n/)) {
        if (!line.startsWith("0:")) continue;
        try {
            const value = JSON.parse(line.slice(2));
            if (typeof value === "string") chunks.push(value);
        } catch (_) {
            // ignore malformed chunk
        }
    }
    return chunks.join("");
}

exports.initialize = async ({ req, res }) => {
    const uid = (req.query.uid || "").trim();
    const prompt = (req.query.prompt || "").trim();
    const includeRaw = req.query.debug === "1";

    if (!uid) {
        return res.status(400).json({ error: "Query parameter 'uid' is required." });
    }

    if (!prompt) {
        const conversation = seedConversation(uid) || [];
        const lastAssistant = [...conversation].reverse().find(msg => msg.role === "assistant");
        return res.json({
            uid,
            prompt,
            reply: lastAssistant ? lastAssistant.content || defaultReply : defaultReply,
            note: lastAssistant ? "Returned last assistant reply." : "No history yet; default response.",
            historyLength: conversation.length,
            history: includeRaw ? structuredClone(conversation) : undefined
        });
    }

    if (prompt.toLowerCase() === "clear") {
        conversations.delete(uid);
        return res.json({
            uid,
            prompt,
            reply: "History cleared.",
            note: "Conversation reset for this uid.",
            historyLength: 0
        });
    }

    const conversation = seedConversation(uid);
    conversation.push(createTextMessage("user", prompt));

    let reply = defaultReply;
    let note = "Fell back to cached reply because real API forward failed.";
    let source = "fallback";
    let status = 0;
    let rawStream;
    let payloadUsed;

    if (!COOKIE) {
        note = "LIVE CALL SKIPPED: set AITUTOR_COOKIE to enable forwarding.";
    } else {
        try {
            const payload = buildPayload(conversation, req.query.chatSessionId);
            payloadUsed = payload;

            const headers = {
                "Content-Type": sanitizeHeader("application/json"),
                "Accept": sanitizeHeader("*/*"),
                "User-Agent": sanitizeHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"),
                "x-app-name-id": sanitizeHeader(APP_NAME_ID),
                "Referer": sanitizeHeader(REFERER),
                "Cookie": sanitizeHeader(COOKIE)
            };

            const response = await axios.post(CHAT_ENDPOINT, payload, {
                headers,
                responseType: "text",
                validateStatus: () => true,
                timeout: 30_000
            });

            status = response.status;
            rawStream = response.data;
            const streamingReply = parseStreamingBody(String(response.data || ""));
            const normalizedReply = streamingReply.trim() || String(response.data || "").trim();

            if (normalizedReply) {
                reply = normalizedReply;
                conversation.push(createTextMessage("assistant", reply));
                note = "Reply streamed from live API.";
                source = "real";
            } else {
                conversation.push(createTextMessage("assistant", reply));
                note = "Live API returned no text; using cached reply.";
            }
        } catch (error) {
            const detail = error.response ? `HTTP ${error.response.status}` : error.message;
            if (error.response && error.response.data) rawStream = String(error.response.data);
            if (!includeRaw) rawStream = undefined; // avoid leaking HTML errors by default
            note = `Live API request failed (${detail}); using cached reply.`;
            status = error.response ? error.response.status : 0;
            conversation.push(createTextMessage("assistant", reply));
        }
    }

    return res.json({
        uid,
        prompt,
        reply,
        note,
        source,
        historyLength: conversation.length,
        status,
        history: includeRaw ? structuredClone(conversation) : undefined,
        rawStream: includeRaw ? rawStream : undefined,
        payloadUsed: includeRaw ? payloadUsed : undefined
    });
};
