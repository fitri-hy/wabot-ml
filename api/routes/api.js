const express = require("express");
const axios = require("axios");
const router = express.Router();

const MessageController = require("../controllers/MessageController");
router.get("/messages/all", MessageController.allMessages);
router.get("/messages/latest", MessageController.latestMessages);
router.get("/messages/chat/:msgChatType", MessageController.chatTypeMessages);
router.get("/messages/type/:msgType", MessageController.typeMessages);
router.get("/messages/group/:groupName", MessageController.groupMessages);

const analyzeMessages = require("../machine-learning/Analyze");
router.get("/ml/analysis", async (req, res) => {
  try {
    const { data: messages } = await axios.get("http://localhost:3000/api/messages/all");
    const result = analyzeMessages(messages);
    res.json(result);
  } catch (err) {
    console.error("Error during analysis:", err);
    res.status(500).send("Analysis failed.");
  }
});

module.exports = router;
