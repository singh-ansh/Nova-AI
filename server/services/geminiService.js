const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(history, file = null) {

  let contents = history;

  // Image Support
  if (file && file.mimetype.startsWith("image/")) {

    const imageBytes = fs.readFileSync(file.path);

    contents = [
      ...history,
      {
        role: "user",
        parts: [
          {
            text: history[history.length - 1]?.parts?.[0]?.text ||
              "Analyze this image.",
          },
          {
            inlineData: {
              mimeType: file.mimetype,
              data: imageBytes.toString("base64"),
            },
          },
        ],
      },
    ];
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return response.text;
}

// ===============================
// Generate Chat Title
// ===============================
async function generateTitle(firstMessage) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Generate a short chat title (maximum 5 words).

Only return the title.

User message:
${firstMessage}
`,
  });

  return response.text.trim().replace(/["']/g, "");
}

module.exports = {
  generateResponse,
  generateTitle,
};