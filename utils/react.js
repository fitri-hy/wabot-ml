async function reactMessage(sock, msgKey, emoji) {
    try {
        await sock.sendMessage(msgKey.remoteJid, {
            react: { text: emoji, key: msgKey }
        });
    } catch (err) {
        console.error("❗ Gagal mengirim reaksi:", err);
    }
}

module.exports = { reactMessage };
