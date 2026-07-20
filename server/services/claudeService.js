const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateClaudeResponse(history) {
  try {

    const messages = history.map((msg) => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts.map((p) => ({
        type: "text",
        text: p.text,
      })),
    }));

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",

      max_tokens: 8192,

      temperature: 0.7,

      messages,
    });

    return response.content[0].text;

  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  generateClaudeResponse,
};