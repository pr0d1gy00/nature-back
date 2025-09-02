"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const authenticateToken_1 = require("./middleware/authenticateToken");
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const encryptedId_1 = require("./services/encryptedId");
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const store_routes_1 = __importDefault(require("./routes/store.routes"));
const dolar_routes_1 = __importDefault(require("./routes/dolar.routes"));
const comments_routes_1 = __importDefault(require("./routes/comments.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
require("./services/schedulerDolar");
const app = (0, express_1.default)();
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/nature/auth", auth_routes_1.default);
app.use("/api/nature/user", authenticateToken_1.authenticateToken, user_routes_1.default);
app.use("/api/nature/category", authenticateToken_1.authenticateToken, category_route_1.default);
app.use("/api/nature/product", product_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/nature/comments", comments_routes_1.default);
app.use("/api/nature/orders", order_routes_1.default);
app.use("/api/nature/dolar", dolar_routes_1.default);
app.use("/api/nature/inventory", authenticateToken_1.authenticateToken, inventory_routes_1.default);
app.use("/api/nature/store", store_routes_1.default);
app.use("/api/nature/profile", profile_routes_1.default);
app.post('/api/verify-token', (req, res) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token)
        return res.status(401).json({ ok: false });
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT_SECRET no definido");
        const result = jsonwebtoken_1.default.verify(token, secret);
        if (typeof result === "string" || result === null || typeof result !== "object") {
            throw new Error("Token inválido");
        }
        const payload = result;
        if (!payload.email || !payload.id || !payload.role_id) {
            throw new Error("Payload incompleto");
        }
        let roleId = payload.role_id;
        if (typeof roleId === 'string' && roleId.length > 0) {
            roleId = (0, encryptedId_1.decryptId)(roleId);
        }
        return res.json({ ok: true, role_id: Number(roleId) });
    }
    catch (err) {
        console.error('verify-token error', err);
        return res.status(401).json({ ok: false });
    }
});
app.listen(8000, () => {
    console.log("Example app listening on port 8000!");
});
