"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodeMailer_1 = require("./nodeMailer");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8000;
const MONGO_URI = "mongodb+srv://tse9406:PcFZu9ZgVWibinOs@fooddelivery.hxrouha.mongodb.net/";
const JWT_SECRET = "foodDelivery";
mongoose_1.default.connect(MONGO_URI).then(() => console.log("✅ DB connected"));
/* ---------------- SCHEMAS ---------------- */
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const UserModel = mongoose_1.default.model("Users", UserSchema, "users");
const OtpSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Users", required: true },
});
const OtpModel = mongoose_1.default.model("Otp", OtpSchema);
/* ---------------- HELPERS ---------------- */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/* ---------------- ROUTES ---------------- */
// ✅ Signup
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    const existing = await UserModel.findOne({ email: trimmedEmail });
    if (existing) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashed = await bcrypt_1.default.hash(password, 10);
    await UserModel.create({ email: trimmedEmail, password: hashed });
    res.json({ message: "Successfully registered" });
});
// ✅ Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Wrong password" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Logged in", token });
});
// ✅ Forgot-password
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    console.log("📨 Email received:", trimmedEmail);
    const user = await UserModel.findOne({ email: trimmedEmail });
    console.log("🔎 User хайлтын үр дүн:", user);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OtpModel.create({ code, expiresAt, user: user._id });
    await nodeMailer_1.transporter.sendMail({
        from: "tse9406@gmail.com",
        to: user.email,
        subject: "Your OTP Code",
        html: `<h3>Your OTP</h3><p>${code}</p><p>This code expires in 5 minutes.</p>`,
    });
    res.json({ message: "OTP sent to email" });
});
// ✅ Verify OTP
app.post("/verify-otp", async (req, res) => {
    const { email, code } = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const otpEntry = await OtpModel.findOne({
        code: String(code),
        user: user._id,
    }).populate("user");
    if (!otpEntry) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpEntry.expiresAt < new Date()) {
        return res.status(400).json({ message: "Expired OTP" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "10m",
    });
    await OtpModel.deleteOne({ _id: otpEntry._id });
    res.json({ message: "OTP verified", token });
});
// ✅ Reset password
app.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const hashed = await bcrypt_1.default.hash(password, 10);
        await UserModel.findByIdAndUpdate(decoded.userId, {
            password: hashed,
            updatedAt: new Date(),
        });
        res.json({ message: "Password reset successfully" });
    }
    catch {
        res.status(400).json({ message: "Invalid or expired token" });
    }
});
// ✅ Token verify
app.post("/verify", (req, res) => {
    const { token } = req.body;
    try {
        const destructToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({ destructToken });
    }
    catch {
        res.status(400).json({ message: "Invalid token" });
    }
});
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
