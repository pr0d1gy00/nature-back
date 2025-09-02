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
exports.removeUser = exports.modifyUser = exports.getUsers = exports.getUser = exports.addUser = void 0;
const userService_1 = require("../services/userService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryptedId_1 = require("../services/encryptedId");
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData.email || !userData.password || !userData.name || !userData.phone || !userData.address || !userData.dni) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    if (userData.password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    if (userData.email.includes('@')) {
        return res.status(400).json({ message: "El email no es válido" });
    }
    const password = yield bcrypt_1.default.hash(userData.password, 10);
    const newUserToRegister = Object.assign(Object.assign({}, userData), { password, role_id: 2 });
    try {
        const newUser = yield (0, userService_1.createUser)(newUserToRegister);
        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    }
    catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
});
exports.addUser = addUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const user = yield (0, userService_1.getUserById)(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const encryptedUser = Object.assign(Object.assign({}, user), { id: (0, encryptedId_1.encryptId)(user.id.toString()) });
        res.status(200).json({ message: 'Usuario obtenido exitosamente', user: encryptedUser });
    }
    catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
});
exports.getUser = getUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getAllUsers)();
        if (!users) {
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }
        const encryptedUsers = users.map(user => (Object.assign(Object.assign({}, user), { id: (0, encryptedId_1.encryptId)(user.id.toString()) })));
        res.status(200).json({ message: 'Usuarios obtenidos exitosamente', users: encryptedUsers });
    }
    catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
const modifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    const decryptedId = (0, encryptedId_1.decryptId)(userId.toString());
    const userData = req.body;
    const userDataWithIdDecrypted = Object.assign({ id: parseInt(decryptedId) }, userData);
    const password = yield bcrypt_1.default.hash(req.body.password, 10);
    try {
        const updatedUser = yield (0, userService_1.updateUser)(parseInt(decryptedId), Object.assign(Object.assign({}, userDataWithIdDecrypted), { password }));
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: 'Usuario modificado exitosamente', user: updatedUser });
    }
    catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
});
exports.modifyUser = modifyUser;
const removeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    const decryptedId = (0, encryptedId_1.decryptId)(userId.toString());
    try {
        const deletedUser = yield (0, userService_1.deleteUser)(parseInt(decryptedId));
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
});
exports.removeUser = removeUser;
