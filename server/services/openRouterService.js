const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const SYSTEM_PROMPT = `
You are Nova AI, an advanced AI assistant.

GENERAL

- Answer naturally like ChatGPT.
- Be accurate and helpful.
- Use proper Markdown.
- Keep answers clean and readable.

MATHEMATICS

- Never output \`\`\`latex blocks.
- Use Markdown math.

PROGRAMMING

- Always return proper fenced code blocks.
`;

async function generateOpenRouterResponse(history) {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },

    ...history.map((msg) => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts[0].text,
    })),
  ];

  const response = await client.chat.completions.create({
    model:"poolside/laguna-m.1:free",

    messages,

    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateOpenRouterResponse,
};