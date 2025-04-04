const { features } = require("../config");

async function handleGroupParticipantUpdate(sock, event) {
    const { id, participants, action } = event;
    const groupName = id.split("@")[0];

    const greetingEnabled = features.greetingEnabled;
    const promoteDemoteEnabled = features.promoteDemoteEnabled;
    const banEnabled = features.banEnabled;
    const kickEnabled = features.kickEnabled;

    for (const participant of participants) {
        let message = "";
        let participantName = participant;

        try {
            const contact = await sock.getContactById(participant); 
            participantName = contact.pushname || participant;
        } catch (error) {}

        let mention = `@${participant.split("@")[0]}`;

        if (action === "add" && greetingEnabled) {
            message = `🎉 Selamat datang ${mention}! Semoga betah di grup ini!`;
        } else if (action === "remove" && greetingEnabled) {
            message = `😢 ${mention} telah meninggalkan grup. Semoga bertemu lagi!`;
        } else if (action === "promote" && promoteDemoteEnabled) {
            message = `🚀 Selamat ${mention}, kamu sekarang menjadi Admin grup!`;
        } else if (action === "demote" && promoteDemoteEnabled) {
            message = `⚠️ Maaf ${mention}, kamu tidak lagi menjadi Admin grup.`;
        } else if (action === "kick" && kickEnabled) {
            message = `❌ ${mention} telah dikeluarkan dari grup. Semoga lebih baik ke depannya!`;
        } else if (action === "ban" && banEnabled) {
            message = `🚫 ${mention} telah dibanned dari grup.`;
        }

        if (message) {
            await sock.sendMessage(id, { 
                text: message, 
                mentions: [participant]
            });
        }
    }
}

module.exports = { handleGroupParticipantUpdate };
