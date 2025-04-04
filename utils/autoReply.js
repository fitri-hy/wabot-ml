const { features } = require("../config");
const { TestCommand, ImgCommand, AudioCommand, VideoCommand } = require("../controllers/Utility");

async function handleAutoReply(sock, msg, info) {
    if (!features.autoReply) return;
    const content = info.content.trim().toLowerCase();

    if (info.type === "Text") {
        if (content === "!test") {
            await TestCommand(sock, msg, info);
        }

        if (content === "!img") {
            await ImgCommand(sock, msg, info);
        }

        if (content === "!audio") {
            await AudioCommand(sock, msg, info);
        }

        if (content === "!video") {
            await VideoCommand(sock, msg, info);
        }
    }
}

module.exports = { handleAutoReply };
