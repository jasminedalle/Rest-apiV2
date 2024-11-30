const axios = require("axios");

exports.config = {
  name: "nglspam",
  author: "Clarence",
  description: "Send spam messages to an NGL username.",
  method: 'get',
  category: "tools",
  link: ["/nglspam?username=&amount=&message="]
};

exports.initialize = async function ({ req, res }) {
  const { username, amount, message } = req.query;
  
  if (!username || !amount || !message) {
    return res.status(400).json({
      error: "Missing required parameters",
      message: "Please provide 'username', 'amount', and 'message'.",
      exampleUsage: "/nglspam?username=&amount=&message="
    });
  }

  const parsedAmount = parseInt(amount);
 
  if (isNaN(parsedAmount)) {
    return res.status(400).json({ error: "Amount must be a valid number." });
  }
  if (parsedAmount > 40) {
    return res.status(400).json({ error: "Maximum number of requests is 40." });
  }
  if (parsedAmount < 1) {
    return res.status(400).json({ error: "Amount must be greater than 0." });
  }

  const headers = {
    referer: `https://ngl.link/${username}`,
    "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
  };

  const data = {
    username,
    question: message,
    deviceId: "ea356443-ab18-4a49-b590-bd8f96b994ee",
    gameSlug: "",
    referrer: ""
  };

  try {
    for (let i = 0; i < parsedAmount; i++) {
      await axios.post("https://ngl.link/api/submit", data, { headers });
      console.log(`Message ${i + 1} sent successfully.`);
    }

    res.status(200).json({
      success: true,
      message: `Successfully sent ${parsedAmount} messages to ${username}.`
    });
  } catch (error) {
    console.error("Error in sending messages:", error.message);

    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
      errorDetails: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
