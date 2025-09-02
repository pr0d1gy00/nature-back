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
exports.updateCommentController = exports.deleteCommentController = exports.getAllCalificationsController = exports.getAllCommentsController = exports.getCommentsByProductIdController = exports.createCommentController = void 0;
const commentsService_1 = require("../services/commentsService");
const encryptedId_1 = require("../services/encryptedId");
const createCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, product_id, calification_id, content } = req.body;
    console.log(`Creando comentario para el usuario ${user_id} en el producto ${product_id}, con calificación ${calification_id} y contenido: ${content}`);
    const idUserDecrypted = (0, encryptedId_1.decryptId)(user_id);
    const productDecrypted = (0, encryptedId_1.decryptId)(product_id);
    try {
        const comment = yield (0, commentsService_1.createComment)({ user_id: parseInt(idUserDecrypted), product_id: parseInt(productDecrypted), calification_id, content });
        res.status(201).json({ message: "Comentario creado con éxito", comment });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createCommentController = createCommentController;
const getCommentsByProductIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id } = req.params;
    const productDecrypted = (0, encryptedId_1.decryptId)(product_id);
    try {
        const comments = yield (0, commentsService_1.getCommentsByProductId)(Number(productDecrypted));
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getCommentsByProductIdController = getCommentsByProductIdController;
const getAllCommentsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield (0, commentsService_1.getAllComments)();
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getAllCommentsController = getAllCommentsController;
const getAllCalificationsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const califications = yield (0, commentsService_1.getCalifications)();
        res.status(200).json(califications);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getAllCalificationsController = getAllCalificationsController;
const deleteCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, commentsService_1.deleteComment)(Number(id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deleteCommentController = deleteCommentController;
const updateCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, data } = req.body;
    try {
        const updatedComment = yield (0, commentsService_1.updateComment)(Number(id), data);
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateCommentController = updateCommentController;
