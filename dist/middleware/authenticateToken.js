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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "Token no proporcionado" });
    }
    try {
        // Verifica si el token está en la blacklist
        // const blacklisted = await isBlackListed(token);
        // console.log(blacklisted)
        // if (blacklisted) {
        // 	return res
        // 		.status(403)
        // 		.json({
        // 			message:
        // 				"Token no válido. Por favor, cierre e inicie sesión",
        // 		});
        // }
        // Verifica el token con jwt
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("Error en jwt.verify:", err);
                return res
                    .status(403)
                    .json({
                    message: "Token no válido. Por favor, cierre e inicie sesión",
                });
            }
            // Adjunta el usuario al request y continúa
            req.user = user;
            next();
        });
    }
    catch (error) {
        console.error("Error en authenticateToken:", error);
        return res
            .status(500)
            .json({ message: "Error interno del servidor" });
    }
});
exports.authenticateToken = authenticateToken;
