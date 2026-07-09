const express = require("express");

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const authOptional = require("../middleware/OptionalAuth");

const {
  chatController,
  getChats,
  getMessagesByChatId,
  deleteChat,
  renameChat,
  editMessage,
} = require("../controllers/chatController");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

// Guest + Login
router.post(
  "/",
  optionalAuth,
  upload.single("file"),
  chatController
);

// Login Required
router.get(
  "/",
  optionalAuth,
  getChats
);

router.get(
  "/:chatId",
  authMiddleware,
  getMessagesByChatId
);

router.patch(
  "/:chatId",
  authMiddleware,
  renameChat
);

router.patch(
  "/message/:messageId",
  authMiddleware,
  editMessage
);

router.delete(
  "/:chatId",
  authMiddleware,
  deleteChat
);

module.exports = router;