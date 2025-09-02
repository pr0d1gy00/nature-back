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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const profileService_1 = require("../services/profileService");
const encryptedId_1 = require("../services/encryptedId");
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const decryptedId = (0, encryptedId_1.decryptId)(userId);
    //excluir password
    try {
        const userInfo = yield (0, profileService_1.getAllInfoUserById)(parseInt(decryptedId));
        const _a = userInfo || {}, { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
        return res.json(userWithoutPassword);
    }
    catch (error) {
        console.error("Error al obtener el perfil del usuario:", error.message);
        return res.status(500).json({
            message: error.message || "No se pudo obtener el perfil del usuario",
        });
    }
});
exports.getUserProfile = getUserProfile;
