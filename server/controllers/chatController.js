const Chat = require("../models/Chat");
const Message = require("../models/Message");
const fs = require("fs");

const { extractPdfText } = require("../services/pdfService");

const {
  generateAIResponse,
  generateTitle,
} = require("../services/aiService");

// =====================================
// Get Messages
// =====================================
const getMessagesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const messages = await Message.find({
      chatId,
    }).sort({
      createdAt: 1,
    });

    return res.json({
      success: true,
      messages,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Get Chats
// =====================================
const getChats = async (req, res) => {
  try {

    if (!req.user) {
      return res.json({
        success: true,
        chats: [],
      });
    }

    const chats = await Chat.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    return res.json({
      success: true,
      chats,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Chat Controller
// =====================================
const chatController = async (req, res) => {
  try {

    const isLoggedIn = !!req.user;

    const {
      message,
      chatId,
    } = req.body;

    if (!message && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let currentChatId = chatId;
    let isNewChat = false;

    // ==========================
    // Create Chat (Only Logged In)
    // ==========================
    if (isLoggedIn && !currentChatId) {

      const newChat = await Chat.create({
        title: "New Chat",
        user: req.user._id,
      });

      currentChatId = newChat._id;
      isNewChat = true;

    }

    // ==========================
    // Save User Message
    // ==========================
    if (isLoggedIn) {

      await Message.create({
        chatId: currentChatId,
        role: "user",
        content: message || "",
      });

    }

    // ==========================
    // Build Conversation History
    // ==========================
    let history = [];

    if (isLoggedIn) {

      const previousMessages = await Message.find({
        chatId: currentChatId,
      }).sort({
        createdAt: 1,
      });

      history = previousMessages.map((msg) => ({
        role:
          msg.role === "assistant"
            ? "model"
            : "user",

        parts: [
          {
            text: msg.content,
          },
        ],
      }));

    } else {

      history = [
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
      ];

    }

    // ==========================
    // PDF Support
    // ==========================
    if (
      req.file &&
      req.file.mimetype === "application/pdf"
    ) {

      const pdfText = await extractPdfText(
        req.file.path
      );

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

    // ==========================
    // Generate AI Reply
    // ==========================
    console.log("Uploaded File:", req.file);
    const reply = await generateAIResponse(
      history,
      req.file &&
        req.file.mimetype.startsWith("image/")
        ? req.file
        : null
    );

    // ==========================
    // Delete Uploaded File
    // ==========================
    if (req.file) {

      try {

        fs.unlinkSync(req.file.path);

      } catch (err) {

        console.log("File delete failed");

      }

    }

    // ==========================
    // Save AI Reply
    // ==========================
    if (isLoggedIn) {

      await Message.create({
        chatId: currentChatId,
        role: "assistant",
        content: reply,
      });

    }

    // ==========================
    // Generate Chat Title
    // ==========================
    if (isLoggedIn && isNewChat) {

      try {

        const title = await generateTitle(
          message || "New Chat"
        );

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

    let title = null;

    if (isLoggedIn) {

      const chat = await Chat.findById(
        currentChatId
      );

      title = chat?.title || null;

    }

    return res.status(200).json({
      success: true,
      reply,
      chatId: currentChatId,
      title,
    });

  } catch (error) {

    console.error(error);

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

// =====================================
// Rename Chat
// =====================================
const renameChat = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        user: req.user._id,
      },
      {
        title: title.trim(),
      },
      {
        new: true,
      }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.json({
      success: true,
      chat,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Edit Message
// =====================================
const editMessage = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const chat = await Chat.findOne({
      _id: message.chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    message.content = content;

    await message.save();

    return res.json({
      success: true,
      message,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Delete Chat
// =====================================
const deleteChat = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    await Chat.findByIdAndDelete(chatId);

    await Message.deleteMany({
      chatId,
    });

    return res.json({
      success: true,
      message: "Chat deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Exports
// =====================================
module.exports = {
  chatController,
  getChats,
  getMessagesByChatId,
  renameChat,
  editMessage,
  deleteChat,
};
