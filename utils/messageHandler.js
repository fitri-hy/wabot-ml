const { formatMessageInfo } = require("./formatMessage");
const { saveMessageToJSON } = require("./saveMessage");
const { handleAutoReply } = require("./autoReply");
const { features } = require("../config");

async function handleIncomingMessage(sock, msg) {
    if (!msg.message) return;

    const messageInfo = await formatMessageInfo(sock, msg);

    if (features.showLogs) {
        console.log(`📩 New Message`);
        console.log(`   🏷️ Tipe Chat: ${messageInfo.chatType}`);
        console.log(`   👤 Pengirim: ${messageInfo.sender}${messageInfo.group ? ` (Grup: ${messageInfo.group})` : ""}`);
        console.log(`   📌 Tipe Pesan: ${messageInfo.type}${messageInfo.isViewOnce ? " (Sekali Lihat)" : ""}`);
        console.log(`   💬 Isi Pesan: ${messageInfo.content}`);

        if (messageInfo.mediaUrl) {
            console.log(`   🔗 URL Media: ${messageInfo.mediaUrl}`);
            console.log(`   📂 Ukuran File: ${messageInfo.size}`);
        }
    }

    saveMessageToJSON({
        timestamp: new Date().toISOString(),
        chatType: messageInfo.chatType,
        sender: messageInfo.sender,
        group: messageInfo.group,
        type: messageInfo.type,
        content: messageInfo.content,
        mediaUrl: messageInfo.mediaUrl,
        size: messageInfo.size,
        isViewOnce: messageInfo.isViewOnce || false,
    });

    await handleAutoReply(sock, msg, messageInfo);
}

module.exports = { handleIncomingMessage };
