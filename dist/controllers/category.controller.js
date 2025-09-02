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
exports.removeCategory = exports.modifyCategory = exports.getCategories = exports.getCategory = exports.addCategory = void 0;
const categoryService_1 = require("../services/categoryService");
const encryptedId_1 = require("../services/encryptedId");
const encryptedId_2 = require("../services/encryptedId");
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_user, name, description } = req.body;
    const decryptedId = (0, encryptedId_2.decryptId)(id_user.toString());
    try {
        const newCategory = yield (0, categoryService_1.createCategory)({ id_user: decryptedId, name, description });
        res.status(201).json({ message: 'Categoría creada exitosamente', category: newCategory });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.addCategory = addCategory;
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const decryptedId = (0, encryptedId_2.decryptId)(categoryId);
    try {
        const category = yield (0, categoryService_1.getCategoryById)(decryptedId);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        const encryptedCategories = Object.assign(Object.assign({}, category), { id: (0, encryptedId_1.encryptId)(category === null || category === void 0 ? void 0 : category.id.toString()) });
        res.status(200).json({ category: encryptedCategories });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getCategory = getCategory;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, categoryService_1.getAllCategories)();
        if (!categories) {
            return res.status(404).json({ message: "No se encontraron categorías" });
        }
        const encryptedCategories = categories.map(category => (Object.assign(Object.assign({}, category), { id: (0, encryptedId_1.encryptId)(category.id.toString()) })));
        res.status(200).json({ categories: encryptedCategories });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getCategories = getCategories;
const modifyCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_user, id, name, description } = req.body;
    const decryptedIdUser = (0, encryptedId_2.decryptId)(id_user.toString());
    const decryptedId = (0, encryptedId_2.decryptId)(id);
    try {
        const updatedCategory = yield (0, categoryService_1.updateCategory)({ id_user: decryptedIdUser, id: parseInt(decryptedId), name, description });
        res.status(200).json({ message: 'Categoría modificada exitosamente', category: updatedCategory });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.modifyCategory = modifyCategory;
const removeCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, id_user } = req.params;
    const decryptedIdUser = (0, encryptedId_2.decryptId)(id_user.toString());
    const decryptedId = (0, encryptedId_2.decryptId)(id);
    try {
        yield (0, categoryService_1.deleteCategory)(decryptedId, parseInt(decryptedIdUser));
        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.removeCategory = removeCategory;
