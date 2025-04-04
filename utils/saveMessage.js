const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");
const config = require("../config");

const dataFile = path.join(__dirname, "..", "data", "message.json");

function saveMessageToJSON(messageData) {
    if (!config.features.saveMessages) {
        return;
    }

    if (messageData.timestamp) {
        const dt = DateTime.fromISO(messageData.timestamp, { zone: "utc" });
        messageData.timestamp = dt.setZone("Asia/Jakarta").toISO();
    }

    let existing = [];

    if (fs.existsSync(dataFile)) {
        const raw = fs.readFileSync(dataFile);
        try {
            existing = JSON.parse(raw);
        } catch (e) {
            existing = [];
        }
    }

    existing.push(messageData);

    fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2));
}

module.exports = { saveMessageToJSON };
