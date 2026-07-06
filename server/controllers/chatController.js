const { generateResponse } = require("../services/geminiService");
const Message = require("../models/Message");

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }
    await Message.create({
      role: "user",
      content: message,
    });
    const reply = await generateResponse(message);

    await Message.create({
      role: "assistant",
      content: reply,
    });

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