const { generateResponse } = require("../services/geminiService");

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await generateResponse(message);

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
      console.error("Gemini Error:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

module.exports = { chatController };