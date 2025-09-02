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
exports.updateComment = exports.getCalifications = exports.deleteComment = exports.getAllComments = exports.getCommentsByProductId = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createComment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validUserExist = yield prisma.user.findUnique({
            where: { id: Number(data.user_id) }
        });
        if (!validUserExist) {
            throw new Error("Usuario no válido");
        }
        const comment = yield prisma.comments.create({
            data
        });
        return comment;
    }
    catch (error) {
        console.error("Error al crear el comentario:", error.message);
        throw new Error(error.message || "No se pudo crear el comentario");
    }
});
exports.createComment = createComment;
const getCommentsByProductId = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validProductExist = yield prisma.product.findUnique({
            where: { id: Number(product_id) }
        });
        if (!validProductExist) {
            throw new Error("Producto no válido");
        }
        const comments = yield prisma.comments.findMany({
            where: { product_id: Number(product_id) },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                calification: true
            }
        });
        return comments;
    }
    catch (error) {
        console.error("Error al obtener los comentarios:", error.message);
        throw new Error(error.message || "No se pudo obtener los comentarios");
    }
});
exports.getCommentsByProductId = getCommentsByProductId;
const getAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield prisma.comments.findMany();
        return comments;
    }
    catch (error) {
        console.error("Error al obtener todos los comentarios:", error.message);
        throw new Error(error.message || "No se pudo obtener todos los comentarios");
    }
});
exports.getAllComments = getAllComments;
const deleteComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validCommentExist = yield prisma.comments.findUnique({
            where: { id: Number(id) }
        });
        if (!validCommentExist) {
            throw new Error("Comentario no válido");
        }
        yield prisma.comments.delete({
            where: { id: Number(id) }
        });
        return { message: "Comentario eliminado con éxito" };
    }
    catch (error) {
        console.error("Error al eliminar el comentario:", error.message);
        throw new Error(error.message || "No se pudo eliminar el comentario");
    }
});
exports.deleteComment = deleteComment;
const getCalifications = () => __awaiter(void 0, void 0, void 0, function* () {
    const califications = yield prisma.califications.findMany({
        orderBy: {
            value: 'asc'
        }
    });
    return califications;
});
exports.getCalifications = getCalifications;
const updateComment = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validCommentExist = yield prisma.comments.findUnique({
            where: { id: Number(id) }
        });
        if (!validCommentExist) {
            throw new Error("Comentario no válido");
        }
        const updatedComment = yield prisma.comments.update({
            where: { id: Number(id) },
            data: Object.assign({}, data)
        });
        return updatedComment;
    }
    catch (error) {
        console.error("Error al actualizar el comentario:", error.message);
        throw new Error(error.message || "No se pudo actualizar el comentario");
    }
});
exports.updateComment = updateComment;
