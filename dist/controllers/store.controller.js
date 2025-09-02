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
exports.getCategoriesForFilters = exports.getProductsByNameController = exports.getProductsByFilters = exports.getProductStore = exports.getProductsToShowStore = void 0;
const storeServices_1 = require("../services/storeServices");
const encryptedId_1 = require("../services/encryptedId");
const getProductsToShowStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, storeServices_1.getProductsToStore)();
        const productIdEncrypted = products.map(product => (Object.assign(Object.assign({}, product), { id: (0, encryptedId_1.encryptId)(product.id.toString()) })));
        res.status(200).json({ message: "Productos Obtenido", products: productIdEncrypted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProductsToShowStore = getProductsToShowStore;
const getProductStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id } = req.body;
    const idDecrypted = (0, encryptedId_1.decryptId)(product_id);
    console.log(idDecrypted);
    try {
        const { product, listProductRelated } = yield (0, storeServices_1.getProductByIdToStore)(parseInt(idDecrypted));
        const productEncrypted = Object.assign(Object.assign({}, product), { id: (0, encryptedId_1.encryptId)(product.id.toString()), category_id: (0, encryptedId_1.encryptId)(product.category_id.toString()) });
        const listProductsEncrypted = listProductRelated.map((item) => (Object.assign(Object.assign({}, item), { id: (0, encryptedId_1.encryptId)(item.id.toString()), category_id: (0, encryptedId_1.encryptId)(item.category_id.toString()) })));
        res.status(200).json({ message: "Producto obtenido exitosamente", product: productEncrypted, listProducts: listProductsEncrypted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProductStore = getProductStore;
const getProductsByFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filters } = req.body;
    console.log(filters);
    try {
        const products = yield (0, storeServices_1.getProductByFilters)(filters);
        const productIdEncrypted = products.map(product => (Object.assign(Object.assign({}, product), { id: (0, encryptedId_1.encryptId)(product.id.toString()) })));
        console.log(productIdEncrypted);
        res.status(200).json({ message: "Productos Obtenidos", products: productIdEncrypted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProductsByFilters = getProductsByFilters;
const getProductsByNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nameProductSearch } = req.params;
    try {
        const products = yield (0, storeServices_1.getProductsByName)(nameProductSearch);
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }
        const productIdEncrypted = products.map(product => (Object.assign(Object.assign({}, product), { id: (0, encryptedId_1.encryptId)(product.id.toString()) })));
        res.status(200).json({ message: "Productos Obtenidos", products: productIdEncrypted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProductsByNameController = getProductsByNameController;
const getCategoriesForFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, storeServices_1.getCategoriesToFiltersProducts)();
        res.status(200).json({ message: "Categorías Obtenidas", categories });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getCategoriesForFilters = getCategoriesForFilters;
