"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.logout = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailSenderService_1 = require("../services/emailSenderService");
const encryptedId_1 = require("../services/encryptedId");
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Usuario no encontrado" });
    const { password: _, reset_code: __, reset_code_expires: ___, created_at: ____, updated_at: _____, role_id: ______, email: _______, dni: ________ } = user, userWithoutPassword = __rest(user, ["password", "reset_code", "reset_code_expires", "created_at", "updated_at", "role_id", "email", "dni"]);
    const encryptedUser = Object.assign(Object.assign({}, userWithoutPassword), { id: (0, encryptedId_1.encryptId)(userWithoutPassword.id.toString()) });
    const payload = {
        email: user.email,
        id: (0, encryptedId_1.encryptId)(user.id.toString()),
        role_id: (0, encryptedId_1.encryptId)(user.role_id.toString())
    };
    const valid = yield bcrypt_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ message: "Credenciales Incorrectas" });
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 12 * 60 * 60 * 1000
    });
    return res.status(200).json({ message: "inicio de sesión exitoso.", user: encryptedUser, token });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    res.clearCookie("token");
    return res.status(200).json({ message: "Sesión cerrada exitosamente" });
});
exports.logout = logout;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const html = `
	<div style="background-color:#fdfee7; font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
		<h1 style="color:#7ed957; font-size: 30px;">Codigo de recuperacion <span style="color: #35384b;">Nature</span></h1>

		<h2 style="color: #7ed957; font-size: 24px;">Recuperación de contraseña</h2>
		<p style="color: #888; font-size: 20px;">Hola <b>${user.name || user.email}</b>,</p>
		<p>Tu código de recuperación es:</p>
		<div style="font-size: 2em; font-weight: bold; color: #4CA7ed957F50; margin: 16px 0;">${code}</div>
		<p style="color: #888; font-weight: bold;">Este código expirará en 1 hora.</p>
		<p style="color: #888; font-size: 14px;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
		<hr>
		<p style="font-size: 16px; color: #7ed957;">Nature App</p>
	</div>
	`;
    yield prisma.user.update({
        where: { email },
        data: {
            reset_code: code,
            reset_code_expires: new Date(Date.now() + 7200000)
        }
    });
    yield (0, emailSenderService_1.sendEmail)(email, "Código de recuperación", `Tu código es: ${code}`, html);
    return res.status(200).json({ message: "Código enviado al correo" });
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, repeatPassword, code } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Usuario no encontrado" });
    if (!user || !user.reset_code || !user.reset_code_expires) {
        return res.status(400).json({ message: "No posee codigo de restablecimiento. Por favor solicite uno nuevo." });
    }
    if (user.reset_code !== code) {
        return res.status(400).json({ message: "Código incorrecto" });
    }
    if (user.reset_code_expires < new Date()) {
        return res.status(400).json({ message: "El código ha expirado" });
    }
    if (newPassword !== repeatPassword) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield prisma.user.update({
        where: { email },
        data: { password: hashedPassword, reset_code: null, reset_code_expires: null }
    });
    return res.status(200).json({ message: "Contraseña actualizada con éxito" });
});
exports.resetPassword = resetPassword;
