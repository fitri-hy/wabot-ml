const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");

router.get("/messages/all", MessageController.allMessages);
router.get("/messages/latest", MessageController.latestMessages);
router.get("/messages/chat/:msgChatType", MessageController.chatTypeMessages);
router.get("/messages/type/:msgType", MessageController.typeMessages);
router.get("/messages/group/:groupName", MessageController.groupMessages);

module.exports = router;
