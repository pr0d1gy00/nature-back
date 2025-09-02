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
exports.removeProduct = exports.getStockOfProduct = exports.modifyProduct = exports.getProduct = exports.modifyStockProduct = exports.getProducts = exports.addProduct = void 0;
const productService_1 = require("../services/productService");
const encryptedId_1 = require("../services/encryptedId");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_user, name, description, price, categoryId, offert, is_active, stock, minimum_stock, } = req.body;
    const decryptedCategory = (0, encryptedId_1.decryptId)(categoryId);
    const files = req.files;
    const mediaData = files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith("image/")
            ? "image"
            : "video",
    }));
    const data = {
        name,
        description,
        price,
        category_id: parseInt(decryptedCategory),
        offert: offert === "true" ? true : offert === true,
        is_active: is_active === "true" ? true : is_active === true
    };
    try {
        const newProduct = yield (0, productService_1.createProduct)(data, mediaData, parseInt(stock), parseInt(minimum_stock), parseInt(id_user));
        res.status(201).json({ message: "Producto creado exitosamente", product: newProduct });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.addProduct = addProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, productService_1.getAllProducts)();
        const productIdEncrypted = products.map(product => (Object.assign(Object.assign({}, product), { id: (0, encryptedId_1.encryptId)(product.id.toString()) })));
        res.status(200).json({ message: "Productos obtenidos exitosamente", products: productIdEncrypted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProducts = getProducts;
const modifyStockProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_user, id, stock, minimum_stock } = req.body;
    const idUserDecrypted = (0, encryptedId_1.decryptId)(id_user);
    console.log(id);
    try {
        const updatedStock = yield (0, productService_1.updateStockProduct)(parseInt(id), parseInt(idUserDecrypted), parseInt(stock), parseInt(minimum_stock));
        res.status(200).json({ message: "Stock del producto modificado exitosamente", stock: updatedStock });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.modifyStockProduct = modifyStockProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idDecrypted = (0, encryptedId_1.decryptId)(id);
    try {
        const product = yield (0, productService_1.getProductById)(parseInt(idDecrypted));
        const productEncrypted = Object.assign(Object.assign({}, product), { id: (0, encryptedId_1.encryptId)(product.id.toString()), category_id: (0, encryptedId_1.encryptId)(product.category_id.toString()) });
        res.status(200).json({ message: "Producto obtenido exitosamente", product: productEncrypted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProduct = getProduct;
const modifyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_user, mediaIds, id, name, description, price, categoryId, offert, is_active, } = req.body;
    const idUserDecrypted = (0, encryptedId_1.decryptId)(id_user);
    const idDecrypted = (0, encryptedId_1.decryptId)(id);
    const decryptedCategory = (0, encryptedId_1.decryptId)(categoryId);
    const files = req.files;
    console.log("Files:", files);
    const IdsOfMedia = JSON.parse(mediaIds);
    console.log("IdsOfMedia:", IdsOfMedia);
    const mediaData = files.map((file, index) => ({
        id: 0,
        product_id: parseInt(idDecrypted),
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith("image/")
            ? "image"
            : "video",
    }));
    const data = {
        id: parseInt(idDecrypted),
        category_id: parseInt(decryptedCategory),
        name,
        description,
        price,
        offert: offert === "true" ? true : offert === true,
        is_active: is_active === "true" ? true : is_active === true
    };
    const mediaIdsFiltered = IdsOfMedia.filter(id => id !== 0);
    console.log("Filtered Media IDs:", mediaIdsFiltered);
    try {
        const updatedProduct = yield (0, productService_1.updateProduct)(data, mediaIdsFiltered, mediaData, parseInt(idUserDecrypted));
        res.status(200).json({ message: "Producto modificado exitosamente", product: updatedProduct });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.modifyProduct = modifyProduct;
const getStockOfProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idDecrypted = (0, encryptedId_1.decryptId)(id);
    try {
        const stock = yield (0, productService_1.getStockProduct)(parseInt(idDecrypted));
        res.status(200).json({ message: "Stock del producto obtenido exitosamente", stock });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getStockOfProduct = getStockOfProduct;
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_user, id } = req.params;
    const idUserDecrypted = (0, encryptedId_1.decryptId)(id_user);
    const idDecrypted = (0, encryptedId_1.decryptId)(id);
    try {
        const deletedProduct = yield (0, productService_1.deleteProduct)(parseInt(idDecrypted), parseInt(idUserDecrypted));
        res.status(200).json({ message: "Producto eliminado exitosamente", product: deletedProduct });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.removeProduct = removeProduct;
