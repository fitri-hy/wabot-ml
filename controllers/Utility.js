const { MessageType, Mimetype } = require('@whiskeysockets/baileys');
const axios = require('axios');
const { reactMessage } = require("../utils/react");

exports.TestCommand = async (sock, msg, info) => {
    const jid = msg.key.remoteJid;
    const text = `Halo, ${info.sender}! 👋 Bot menerima pesanmu.`;

    await reactMessage(sock, msg.key, "🕒");

    try {
        await sock.sendMessage(jid, { text }, { quoted: msg });
        await reactMessage(sock, msg.key, "✅");
    } catch {
        await reactMessage(sock, msg.key, "❌");
    }
};

exports.ImgCommand = async (sock, msg, info) => {
    const jid = msg.key.remoteJid;
    const text = `Halo, ${info.sender}! 👋 Ini adalah gambar yang kamu minta.`;
    await reactMessage(sock, msg.key, "🕒");
    try {
        const imageUrl = 'https://static.vecteezy.com/system/resources/thumbnails/052/248/075/small_2x/peacock-feather-wallpaper-hd-wallpaper-photo.jpeg';
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        const mediaPayload = { image: imageBuffer, caption: text };
        await sock.sendMessage(jid, mediaPayload, { quoted: msg });
        await reactMessage(sock, msg.key, "✅");
    } catch (err) {
        console.error("Error saat mengirim gambar:", err);
        await reactMessage(sock, msg.key, "❌");
    }
};

exports.AudioCommand = async (sock, msg, info) => {
    const jid = msg.key.remoteJid;
    const audioUrl = 'https://github.com/WhiskeySockets/Baileys/blob/master/Media/sonata.mp3?raw=true'; // Gunakan URL mentah untuk file audio
    const text = `Halo, ${info.sender}! 👋 Ini adalah audio yang kamu minta.`;

    await reactMessage(sock, msg.key, "🕒");

    try {
        const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(response.data, 'binary');
        const mediaPayload = {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            caption: text,
            ptt: false
        };
        await sock.sendMessage(jid, mediaPayload, { quoted: msg });
        await reactMessage(sock, msg.key, "✅");
    } catch (err) {
        console.error("Error saat mengirim audio:", err);
        await reactMessage(sock, msg.key, "❌");
    }
};

exports.VideoCommand = async (sock, msg, info) => {
    const jid = msg.key.remoteJid;
    const videoUrl = 'https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'; // URL video
    const text = `Halo, ${info.sender}! 👋 Ini adalah video yang kamu minta.`;

    await reactMessage(sock, msg.key, "🕒");

    try {
        const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const videoBuffer = Buffer.from(response.data, 'binary');
        const mediaPayload = {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: text
        };
        await sock.sendMessage(jid, mediaPayload, { quoted: msg });
        await reactMessage(sock, msg.key, "✅");
    } catch (err) {
        console.error("Error saat mengirim video:", err);
        await reactMessage(sock, msg.key, "❌");
    }
};