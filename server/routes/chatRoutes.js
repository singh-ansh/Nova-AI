const express = require("express");
const upload = require("../middleware/upload");
const {
    chatController,
    getChats,
    getMessagesByChatId,
    deleteChat,
    renameChat,
    editMessage,
} = require("../controllers/chatController");


const router = express.Router();

router.patch("/:chatId", renameChat);
router.delete("/:chatId", deleteChat);
router.get("/", getChats);
router.get("/:chatId", getMessagesByChatId);
router.patch("/message/:messageId", editMessage);

router.post(
    "/",
    upload.single("file"),
    chatController
);

module.exports = router;