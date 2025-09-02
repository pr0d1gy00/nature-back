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
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.getCategoryById = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_user, name, description } = data;
        const slug = name.toLowerCase().replace(/ /g, "-");
        const validUserExist = yield prisma.user.findUnique({
            where: { id: Number(id_user) }
        });
        const validCategoryNotExist = yield prisma.category.findUnique({
            where: { slug }
        });
        if (validCategoryNotExist) {
            throw new Error("La categoría ya existe");
        }
        if (!validUserExist || validUserExist.role_id !== 1) {
            throw new Error("El usuario no existe o no tiene permisos para realizar esta acción");
        }
        const category = yield prisma.category.create({
            data: {
                name,
                slug,
                description
            }
        });
        return category;
    }
    catch (error) {
        console.error("Error al crear la categoría:", error.message);
        throw new Error(error.message || "No se pudo crear la categoría");
    }
});
exports.createCategory = createCategory;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield prisma.category.findUnique({
            where: { id: Number(id) }
        });
        return category;
    }
    catch (error) {
        console.error("Error al obtener la categoría:", error.message);
        throw new Error(error.message || "No se pudo obtener la categoría");
    }
});
exports.getCategoryById = getCategoryById;
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        return categories;
    }
    catch (error) {
        console.error("Error al obtener todas las categorías:", error.message);
        throw new Error(error.message || "No se pudieron obtener las categorías");
    }
});
exports.getAllCategories = getAllCategories;
const updateCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, id_user, name, description } = data;
        const slug = name.toLowerCase().replace(/ /g, "-");
        const validCategoryExist = yield prisma.category.findUnique({
            where: { id: Number(id) }
        });
        if (!validCategoryExist) {
            throw new Error("La categoría no existe");
        }
        const validUserExist = yield prisma.user.findUnique({
            where: { id: Number(id_user) }
        });
        if (!validUserExist || validUserExist.role_id !== 1) {
            throw new Error("El usuario no existe o no tiene permisos para realizar esta acción");
        }
        const updatedCategory = yield prisma.category.update({
            where: { id: Number(id) },
            data: {
                name,
                slug,
                description
            }
        });
        return updatedCategory;
    }
    catch (error) {
        console.error("Error al actualizar la categoría:", error.message);
        throw new Error(error.message || "No se pudo actualizar la categoría");
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (id, idUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validCategoryExist = yield prisma.category.findUnique({
            where: { id: Number(id) }
        });
        if (!validCategoryExist) {
            throw new Error("La categoría no existe");
        }
        const validUserExist = yield prisma.user.findUnique({
            where: { id: Number(idUser) }
        });
        if (!validUserExist || validUserExist.role_id !== 1) {
            throw new Error("El usuario no existe o no tiene permisos para realizar esta acción");
        }
        yield prisma.category.delete({
            where: { id: Number(id) }
        });
        return { message: "Categoría eliminada correctamente" };
    }
    catch (error) {
        console.error("Error al eliminar la categoría:", error.message);
        throw new Error(error.message || "No se pudo eliminar la categoría");
    }
});
exports.deleteCategory = deleteCategory;
