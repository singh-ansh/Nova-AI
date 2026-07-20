const {
  generateResponse,
  generateTitle,
} = require("./geminiService");

const {
  generateOpenRouterResponse,
} = require("./openRouterService");

async function generateAIResponse(history, file = null) {

  // 1. Gemini
  try {

    return await generateResponse(history, file);

  } catch (err) {

    console.log("Gemini Failed");
    console.log(err.message);

  }

  // 2. OpenRouter Backup
  try {

    return await generateOpenRouterResponse(history);

  } catch (err) {

    console.log("OpenRouter Failed");
    console.log(err.message);

  }

  throw new Error("All AI providers failed.");

}

module.exports = {
  generateAIResponse,
  generateTitle,
};