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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield prisma.user.findUnique({
        where: { email: data.email }
    });
    if (userExist) {
        throw new Error("El email ya está en uso");
    }
    try {
        return yield prisma.user.create({
            data
        });
    }
    catch (error) {
        console.error("Error al crear el usuario:", error.message);
        throw new Error(error.message || "No se pudo crear el usuario");
    }
});
exports.createUser = createUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findUnique({
            where: { id }
        });
    }
    catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        throw new Error(error.message || "No se pudo obtener el usuario");
    }
});
exports.getUserById = getUserById;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findMany();
    }
    catch (error) {
        console.error("Error al obtener todos los usuarios:", error.message);
        throw new Error(error.message || "No se pudo obtener los usuarios");
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.email) {
            const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
            if (existingUser && existingUser.id !== id) {
                throw new Error("El email ya está en uso por otro usuario");
            }
        }
        return yield prisma.user.update({
            where: { id },
            data
        });
    }
    catch (error) {
        console.error("Error al actualizar el usuario:", error.message);
        throw new Error(error.message || "No se pudo actualizar el usuario");
    }
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.delete({
            where: {
                id: id
            }
        });
    }
    catch (error) {
        console.error("Error al eliminar el usuario:", error.message);
        throw new Error(error.message || "No se pudo eliminar el usuario");
    }
});
exports.deleteUser = deleteUser;
