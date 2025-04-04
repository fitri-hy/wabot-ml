async function formatMessageInfo(sock, msg) {
    const senderJid = msg.key.remoteJid;
    let chatType = "Unknown";
    let sender = msg.pushName || "Unknown";
    let group = null;
    let content = "Tidak ada isi pesan";
    let type = "Unknown";
    let mediaUrl = null;
    let size = null;
    let isViewOnce = false;

    if (msg.message?.ephemeralMessage) {
        msg.message = msg.message.ephemeralMessage.message;
    }

    if (msg.message?.viewOnceMessage) {
        msg.message = msg.message.viewOnceMessage.message;
        isViewOnce = true;
    }

    if (msg.key.fromMe) {
        chatType = "Dikirim oleh bot";
        sender = "Bot";
    } else if (senderJid.endsWith("@s.whatsapp.net")) {
        chatType = "Private Chat";
    } else if (senderJid.endsWith("@g.us")) {
        chatType = "Group Chat";
        try {
            const metadata = await sock.groupMetadata(senderJid);
            group = metadata.subject;
        } catch (err) {
            group = "Unknown Group";
        }
    } else if (senderJid === "status@broadcast") {
        chatType = "Status";
    }

    const messageKeys = Object.keys(msg.message || {});

    if (messageKeys.includes("reactionMessage")) {
        const data = msg.message.reactionMessage;
        type = "Reaction";
        content = `Reaksi: ${data.text}`;
    } else if (messageKeys.includes("stickerMessage")) {
        const data = msg.message.stickerMessage;
        type = "Sticker";
        content = `[Stiker] ${data.isAnimated ? "(Animasi)" : ""}`;
        mediaUrl = data.url;
        size = `${data.fileLength} bytes`;
    } else if (messageKeys.includes("imageMessage")) {
        const data = msg.message.imageMessage;
        type = "Image";
        content = data.caption || "[Gambar tanpa caption]";
        mediaUrl = data.url;
        size = `${data.fileLength} bytes`;
    } else if (messageKeys.includes("videoMessage")) {
        const data = msg.message.videoMessage;
        type = "Video";
        content = data.caption || "[Video tanpa caption]";
        mediaUrl = data.url;
        size = `${data.fileLength} bytes`;
    } else if (messageKeys.includes("audioMessage")) {
        const data = msg.message.audioMessage;
        type = "Audio";
        content = "[Audio]";
        mediaUrl = data.url;
        size = `${data.fileLength} bytes`;
    } else if (messageKeys.includes("documentMessage")) {
        const data = msg.message.documentMessage;
        type = "Document";
        content = data.caption || `[Dokumen: ${data.fileName || "Tanpa Nama"}]`;
        mediaUrl = data.url;
        size = `${data.fileLength} bytes`;
    } else if (messageKeys.includes("conversation") || messageKeys.includes("extendedTextMessage")) {
        type = "Text";
        content = msg.message.conversation || msg.message.extendedTextMessage?.text || "Tidak ada teks";
    } else if (messageKeys.includes("senderKeyDistributionMessage") && messageKeys.length === 1) {
        type = "System";
        content = "[Distribusi Kunci Grup - Diabaikan]";
    } else {
        type = "Unknown";
        content = `[Pesan tidak dikenali] (${messageKeys.join(", ")})`;
    }

    return {
        chatType,
        sender,
        group,
        content,
        type,
        mediaUrl,
        size,
        isViewOnce
    };
}

module.exports = { formatMessageInfo };
