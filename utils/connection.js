const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require("readline");
const { features } = require("../config");
const { handleIncomingMessage } = require("./messageHandler");
const { handleGroupParticipantUpdate } = require("../controllers/GroupParticipant");
const fs = require("fs");
const path = require("path");

async function question(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

async function startSocket() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: !features.usePairingCode,
        logger: pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    if (features.usePairingCode && !sock.authState.creds.registered) {
        const phone = await question("📱 Masukkan nomor HP (dengan kode negara, contoh: 6281234567890): ");
        const code = await sock.requestPairingCode(phone);
        console.log(`🔗 Pairing Code: ${code}`);
    }

    sock.ev.on("messages.upsert", async ({ messages }) => {
        await handleIncomingMessage(sock, messages[0]);
    });

    sock.ev.on("group-participants.update", async (event) => {
        await handleGroupParticipantUpdate(sock, event);
    });

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log("❌ Bot logout. Silakan scan ulang.");
                
                const authFolder = path.join(__dirname, "auth");
                if (fs.existsSync(authFolder)) {
                    fs.rmSync(authFolder, { recursive: true, force: true });
                    console.log("✅ Folder 'auth' telah dihapus.");
                }
                
                console.log("🔄 Mencoba untuk menyambung kembali...");
                startSocket(); 
            } else {
                console.log("🔄 Bot terputus, mencoba menyambung kembali...");
                setTimeout(() => startSocket(), 5000);
            }
        } else if (connection === "open") {
            console.log("🟢 Bot berhasil tersambung!");
        }
    });
}

module.exports = { startSocket };
