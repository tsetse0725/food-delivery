"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(auth_routes_1.default);
const PORT = 8000;
const MONGO_URI = process.env.MONGO_URI || "";
// ✅ DB connect
mongoose_1.default.connect(MONGO_URI);
// ✅ Once Mongo connection is fully open
mongoose_1.default.connection.once("open", () => {
    const dbName = mongoose_1.default.connection.db?.databaseName || "(unknown)";
    console.log("✅ DB connected");
    console.log("📦 Used DB:", dbName);
    app.listen(PORT, () => {
        console.log(`🚀 Server on http://localhost:${PORT}`);
    });
});
// ❌ Error listener
mongoose_1.default.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});
