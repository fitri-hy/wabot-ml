const { startSocket } = require("./utils/connection");
console.log("🚀 Bot WhatsApp sedang berjalan...");
startSocket();

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const apiRoutes = require("./api/routes/api");
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
