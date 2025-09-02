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
exports.getCategoriesToFiltersProducts = exports.getProductByIdToStore = exports.getProductsByName = exports.getProductByFilters = exports.getProductsToStore = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductsToStore = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: {
                deleted_at: null,
            },
            include: {
                product_media: true,
                inventory: true,
            },
        });
        return products;
    }
    catch (error) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error(error.message || "No se pudo obtener los productos");
    }
});
exports.getProductsToStore = getProductsToStore;
const getProductByFilters = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        // Validar y construir el filtro de precios
        const priceFilter = ((_a = filters.price) === null || _a === void 0 ? void 0 : _a.gte) === 0 && ((_b = filters.price) === null || _b === void 0 ? void 0 : _b.lte) === 0
            ? undefined // Si ambos son 0, no aplicar filtro
            : ((_c = filters.price) === null || _c === void 0 ? void 0 : _c.gte) > ((_d = filters.price) === null || _d === void 0 ? void 0 : _d.lte)
                ? undefined // Si el rango es inválido, no aplicar filtro
                : {
                    gte: (_e = filters.price) === null || _e === void 0 ? void 0 : _e.gte, // Precio mínimo
                    lte: (_f = filters.price) === null || _f === void 0 ? void 0 : _f.lte, // Precio máximo
                };
        // Validar y construir el filtro de categorías
        const categoryFilter = ((_g = filters.category) === null || _g === void 0 ? void 0 : _g.id) && filters.category.id.length > 0
            ? {
                id: { in: filters.category.id }, // Filtrar por múltiples categorías
            }
            : undefined; // Si no hay categorías, no aplicar filtro
        const products = yield prisma.product.findMany({
            where: {
                category: categoryFilter, // Aplicar filtro de categorías si existe
                price: priceFilter, // Aplicar filtro de precios si existe
                deleted_at: null, // Solo productos no eliminados
            },
            include: {
                product_media: true, // Incluir medios relacionados
                inventory: true, // Incluir inventario relacionado
            },
        });
        return products;
    }
    catch (error) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error(error.message || "No se pudo obtener los productos");
    }
});
exports.getProductByFilters = getProductByFilters;
const getProductsByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findMany({
            where: {
                name: {
                    contains: name,
                },
                deleted_at: null,
            },
            include: {
                product_media: true,
                inventory: true,
            },
        });
        return product;
    }
    catch (_a) {
    }
});
exports.getProductsByName = getProductsByName;
const getProductByIdToStore = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findUnique({
            where: {
                id: id,
                AND: {
                    deleted_at: null,
                },
            },
            include: {
                product_media: true,
                category: {
                    select: {
                        name: true,
                    }
                },
                inventory: {
                    select: {
                        stock: true
                    }
                }
            },
        });
        if (!product) {
            throw new Error("El producto no existe");
        }
        const products = yield prisma.product.findMany({
            where: {
                category: {
                    id: product.category_id,
                },
                deleted_at: null,
            },
            include: {
                product_media: true,
                inventory: true,
            },
        });
        const count = 5; // Número de productos aleatorios a seleccionar
        const randomProducts = products
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
        return { product: product, listProductRelated: randomProducts };
    }
    catch (error) {
        console.error("Error al obtener el producto:", error.message);
        throw new Error(error.message || "No se pudo obtener el producto");
    }
});
exports.getProductByIdToStore = getProductByIdToStore;
const getCategoriesToFiltersProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        return categories;
    }
    catch (error) {
        console.error("Error al obtener las categorías:", error.message);
        throw new Error(error.message || "No se pudo obtener las categorías");
    }
});
exports.getCategoriesToFiltersProducts = getCategoriesToFiltersProducts;
