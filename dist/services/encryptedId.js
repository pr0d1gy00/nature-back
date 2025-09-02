"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptId = exports.encryptId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY);
const iv = Buffer.from(process.env.ENCRYPTION_IV);
const encryptId = (id) => {
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(id, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};
exports.encryptId = encryptId;
const decryptId = (encryptedId) => {
    console.log("Decrypting ID:", encryptedId);
    const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedId, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log("Decrypted ID:", decrypted);
    return decrypted;
};
exports.decryptId = decryptId;
