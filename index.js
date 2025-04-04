const { startSocket } = require("./connection");
console.log("🚀 Bot WhatsApp sedang berjalan...");
startSocket();

const express = require("express");
const app = express();
const PORT = 3000;

const apiRoutes = require("./api/routes/api");
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
