const Chat = require("../models/Chat");
const Message = require("../models/Message");
const fs = require("fs");
const { extractPdfText } = require("../services/pdfService");

const {
  generateResponse,
  generateTitle,
} = require("../services/geminiService");
const getMessagesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      chatId,
    }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      chats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const chatController = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let currentChatId = chatId;
    let isNewChat = false;

    // Create new chat
    if (!currentChatId) {
      const newChat = await Chat.create({
        title: "New Chat",
      });

      currentChatId = newChat._id;
      isNewChat = true;
    }

    // Save user's original message
    await Message.create({
      chatId: currentChatId,
      role: "user",
      content: message || "",
    });

    // Load previous history
    const messages = await Message.find({
      chatId: currentChatId,
    }).sort({
      createdAt: 1,
    });

    let history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    // ============================
    // PDF Support
    // ============================
    if (
      req.file &&
      req.file.mimetype === "application/pdf"
    ) {
      const pdfText = await extractPdfText(req.file.path);

      history.push({
        role: "user",
        parts: [
          {
            text:
              `PDF Content:\n\n${pdfText}\n\n` +
              `User Question:\n${message}`,
          },
        ],
      });
    }

    // Gemini
    const reply = await generateResponse(
      history,
      req.file &&
        req.file.mimetype.startsWith("image/")
        ? req.file
        : null
    );

    // Delete uploaded file
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.log("File delete failed");
      }
    }

    // Save AI response
    await Message.create({
      chatId: currentChatId,
      role: "assistant",
      content: reply,
    });

    // Generate title only once
    if (isNewChat) {
      try {
        const title = await generateTitle(message || "New Chat");

        await Chat.findByIdAndUpdate(
          currentChatId,
          {
            title,
          }
        );
      } catch (err) {
        console.log(
          "Title generation failed:",
          err.message
        );
      }
    }

    const chat = await Chat.findById(currentChatId);

    return res.status(200).json({
      success: true,
      reply,
      chatId: currentChatId,
      title: chat.title,
    });

  } catch (error) {
    console.error(error);

    // Delete uploaded file even on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch { }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const renameChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        title: title.trim(),
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      chat,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.content = content;

    await message.save();

    res.json({
      success: true,
      message,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete(chatId);

    await Message.deleteMany({
      chatId,
    });

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  chatController,
  getChats,
  getMessagesByChatId,
  deleteChat,
  renameChat,
  editMessage,
};