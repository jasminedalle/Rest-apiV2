const axios = require('axios');

exports.config = {
  name: 'ai-music',
  author: 'Clarence',
  description: 'Generate music based on a given prompt using MusicHero AI',
  method: 'get',
  category: 'ai',
  link: ['/ai-music?prompt=song+about+nature&style=calm&instrumental=true']
};

exports.initialize = async function ({ req, res }) {
  const { prompt, style = "dreamy", title = `$akira-ace-${Date.now()}${Math.random().toString(36).substr(2, 9)}`, customMode = true, instrumental = false } = req.query;

  if (!prompt) {
    return res.status(400).json({
      error: "Missing required parameter",
      message: "Please provide the 'prompt' parameter to generate music.",
      exampleUsage: "/ai-music?prompt=song+about+nature&style=calm&instrumental=true"
    });
  }

  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    verify: "0.hL0mar7FR-gxO8hV8PpUr_C6Rcr0KsR8kconrecSVqmBk2CX4MhmZIES_niWDZbvpbXruGubaMQuGUI8Vc6yo3OvJ1W1fq93zG2cGYrlV7yXvKP0T9sq1nAHyXiOGfyIFNeK3KILxovMMKGQuziJlu7ZOjJvnH7_7gxjoeEJjKlpvMSHRMu-L1TN6rTipBGdUqjk3WvbEMdc99Lk-6H1gXM-6d36rkWmD7UbXE6GCCTwY1KJRRLoW08ANA7OeIR9mAdDqHb4bLZkDQlppiaMNF9EZtfpGqGiLphVyA8XzKiKegXuyAcCZZmG_W2NatI6XsxTWNmd_gh7TErtAC3eDELMC-kveN-TicuyMjJDROelMBGI_hut-V8WZy9YUFreE2VENN1EDl6d_OTPHkHb1aVw_T5FaSnSoDmgFMkPNbzeskduK3LO8g9w0fKaMfV4v2gT8Su6VzMtoDN7LHhAQzmdXnbNKnm_AIas1fkhdUvTCQYSS2W-Zjf5231Vi_CAXGhjkWPcj9risLoRKXNcAcne6Vi7P8I502vD5pXvFT3uvN3Ma0gWXjNK7_5RLsBy6oA_3B4cnsovjmKw-pw0EQEMd8-AwJJQxv5e0hv4yY1baudBAqgcGxI_huh16YmBGBBqoymlx4AQy5wlMzwoCqGqufzUIXmjl50vay_erQbWV4pXR6snFHNe2yAnp9FFN87gVtezKQtZihGDV6K_uv5fPNH8rBkYldcf59Ws_TDZigCe8tnm_AIMsJdGPf-D.5Nb6Nz3_AitucH0Xm5V2gA.626620269db3c3041ddceeaf1c792c14f09dce66fc5688d31ed6c325f58676a5", 
    uniqueId: `$akira-ace-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
    Referer: "https://musichero.ai/id/app",
    "Accept-Encoding": "gzip, deflate"
  };

  const urlCreate = "https://musicheroai.erweima.ai/api/v1/suno/create";
  const urlLoad = "https://musicheroai.erweima.ai/api/v1/suno/loadPendingRecordList";

  try {
    const dataCreate = { prompt, style, title, customMode, instrumental };
    const resCreate = await axios.post(urlCreate, dataCreate, { headers });
    const recordId = resCreate.data?.data?.recordId;

    if (!recordId) {
      return res.status(500).json({ error: "Failed to create music generation request" });
    }

    const startTime = Date.now();
    while (Date.now() - startTime < 120000) {
      const dataLoad = { pendingRecordIdList: [recordId] };
      const load = await axios.post(urlLoad, dataLoad, { headers });
      const sunoData = load.data?.data?.[0]?.sunoData?.sunoData?.[0];

      if (sunoData?.audioUrl && sunoData?.imageUrl && sunoData?.title && sunoData?.modelName) {
        return res.status(200).json({
          success: true,
          audio: sunoData.audioUrl,
          image: sunoData.imageUrl,
          title: sunoData.title,
          model: sunoData.modelName
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return res.status(500).json({ error: "Music generation timed out" });
  } catch (error) {
    console.error("Error generating music:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while generating music. Please try again later."
    });
  }
};
