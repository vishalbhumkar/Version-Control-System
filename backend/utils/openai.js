const dotenv = require("dotenv");
dotenv.config();

const getOpenAIAPIResponse = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment variables (.env)");
  }

  // Using the new stable gemini-2.5-flash model which is active on your API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Gemini API request failed");
    }

    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      throw new Error("Invalid Gemini API response format");
    }

    const reply = data.candidates[0].content.parts[0].text;
    console.log("Gemini reply:", reply);
    return reply;
  } catch (err) {
    console.error("Gemini call error:", err);
    throw err;
  }
};

module.exports = getOpenAIAPIResponse;
