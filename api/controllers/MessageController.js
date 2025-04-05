const fs = require("fs");
const path = require("path");

exports.allMessages = (req, res) => {
    const filePath = path.join(__dirname, "../../data/message.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Gagal membaca file:", err);
            return res.status(500).json({ error: "Gagal membaca file" });
        }
        try {
            const messages = JSON.parse(data);
            res.json(messages);
        } catch (parseError) {
            console.error("❌ Gagal parsing JSON:", parseError);
            res.status(500).json({ error: "Format JSON tidak valid" });
        }
    });
};

exports.latestMessages = (req, res) => {
    const filePath = path.join(__dirname, "../../data/message.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Gagal membaca file:", err);
            return res.status(500).json({ error: "Gagal membaca file" });
        }
        try {
            let messages = JSON.parse(data);
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const latestMessages = messages.slice(0, 10);

            res.json(latestMessages);
        } catch (parseError) {
            console.error("❌ Gagal parsing JSON:", parseError);
            res.status(500).json({ error: "Format JSON tidak valid" });
        }
    });
};

exports.chatTypeMessages = (req, res) => {
    const filePath = path.join(__dirname, "../../data/message.json");
    const msgChatType = req.params.msgChatType;
    const validChatTypes = {
        "group-chat": "Group Chat",
        "private-chat": "Private Chat",
        "status": "Status"
    };
    const chatType = validChatTypes[msgChatType];
    if (!chatType) {
        return res.status(400).json({
            error: "chatType tidak valid. Gunakan salah satu dari: group-chat, private-chat, status"
        });
    }
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Gagal membaca file:", err);
            return res.status(500).json({ error: "Gagal membaca file" });
        }
        try {
            let messages = JSON.parse(data);

            messages = messages.filter(msg => msg.chatType === chatType);
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            res.json(messages);
        } catch (parseError) {
            console.error("❌ Gagal parsing JSON:", parseError);
            res.status(500).json({ error: "Format JSON tidak valid" });
        }
    });
};

exports.typeMessages = (req, res) => {
    const filePath = path.join(__dirname, "../../data/message.json");
    const msgType = req.params.msgType;
    const validTypes = {
        "text": "Text",
        "reaction": "Reaction",
        "sticker": "Sticker",
        "image": "Image",
        "video": "Video",
        "audio": "Audio",
        "document": "Document",
        "system": "System",
        "unknown": "Unknown"
    };
    const type = validTypes[msgType];
    if (!type) {
        return res.status(400).json({
            error: "type tidak valid. Gunakan tipe seperti: text, image, video, sticker, dll"
        });
    }
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Gagal membaca file:", err);
            return res.status(500).json({ error: "Gagal membaca file" });
        }
        try {
            let messages = JSON.parse(data);

            messages = messages.filter(msg => msg.type === type);
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            res.json(messages);
        } catch (parseError) {
            console.error("❌ Gagal parsing JSON:", parseError);
            res.status(500).json({ error: "Format JSON tidak valid" });
        }
    });
};

exports.groupMessages = (req, res) => {
    const filePath = path.join(__dirname, "../../data/message.json");
    const groupName = req.params.groupName;
    const validTypes = {
        "text": "Text",
        "reaction": "Reaction",
        "sticker": "Sticker",
        "image": "Image",
        "video": "Video",
        "audio": "Audio",
        "document": "Document",
        "system": "System",
        "unknown": "Unknown"
    };
    const { msgChatType, msgType } = req.query;
    if (!groupName) {
        return res.status(400).json({ error: "Parameter groupName diperlukan" });
    }
    let msgTypeList = [];
    if (msgType) {
        msgTypeList = msgType.split(",").map(type => type.trim().toLowerCase());

        const invalidTypes = msgTypeList.filter(type => !validTypes[type]);
        if (invalidTypes.length > 0) {
            return res.status(400).json({ error: `Messgae Type tidak valid: ${invalidTypes.join(", ")}. Gunakan salah satu dari: ${Object.keys(validTypes).join(", ")}` });
        }
    }
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Gagal membaca file:", err);
            return res.status(500).json({ error: "Gagal membaca file" });
        }
        try {
            let messages = JSON.parse(data);
            messages = messages.filter(msg => msg.group === groupName);
            if (msgChatType) {
                messages = messages.filter(msg => msg.chatType === msgChatType);
            }
            if (msgTypeList.length > 0) {
                const validTypeValues = msgTypeList.map(type => validTypes[type]);
                messages = messages.filter(msg => validTypeValues.includes(msg.type));
            }
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            res.json(messages);
        } catch (parseError) {
            console.error("❌ Gagal parsing JSON:", parseError);
            res.status(500).json({ error: "Format JSON tidak valid" });
        }
    });
};
