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
exports.deleteProduct = exports.updateStockProduct = exports.getStockProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProduct = (data, mediaProducts, stock, minimum_stock, idUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.name ||
        !data.category_id ||
        !data.price ||
        data.offert === undefined ||
        data.is_active === undefined ||
        !data.description) {
        throw new Error("Faltan datos obligatorios para crear el producto");
    }
    if (!mediaProducts || mediaProducts.length === 0) {
        throw new Error("Se requieren imágenes para crear el producto");
    }
    if (!stock || stock <= 0) {
        throw new Error("El stock es obligatorio y debe ser mayor que cero");
    }
    const validUserExist = yield prisma.user.findUnique({
        where: { id: Number(idUser) },
    });
    if (!validUserExist || validUserExist.role_id !== 1) {
        throw new Error("El usuario no existe o no tiene permisos para realizar esta acción");
    }
    try {
        const product = yield prisma.product.create({
            data: Object.assign({}, data),
        });
        const productMedia = yield prisma.productMedia.createMany({
            data: mediaProducts.map((image) => (Object.assign(Object.assign({}, image), { product_id: product.id, uploaded_at: new Date() }))),
        });
        const productStock = yield prisma.inventory.create({
            data: {
                product_id: product.id,
                stock: stock,
                minimun_stock: minimum_stock,
            },
        });
        const movementInventory = yield prisma.inventoryMovement.create({
            data: {
                user_id: idUser,
                product_id: product.id,
                quantity: stock,
                type: "entrada",
                created_at: new Date(),
            },
        });
        const allDataProduct = {
            product,
            productMedia,
            productStock,
            movementInventory,
        };
        return allDataProduct;
    }
    catch (error) {
        console.error("Error al crear el producto:", error.message);
        throw new Error(error.message || "No se pudo crear el producto");
    }
});
exports.createProduct = createProduct;
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: {
                deleted_at: null,
            },
            include: {
                product_media: true,
                inventory: true
            }
        });
        return products;
    }
    catch (error) {
        console.error("Error al obtener todos los productos:", error.message);
        throw new Error(error.message || "No se pudo obtener los productos");
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findUnique({
            where: {
                id: Number(id),
                AND: {
                    deleted_at: null,
                },
            },
            include: {
                product_media: true,
            }
        });
        if (!product) {
            throw new Error("El producto no existe");
        }
        return product;
    }
    catch (error) {
        console.error("Error al obtener el producto:", error.message);
        throw new Error(error.message || "No se pudo obtener el producto");
    }
});
exports.getProductById = getProductById;
const updateProduct = (data, idsExist, mediaProducts, idUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.id) {
        throw new Error("El ID del producto es obligatorio");
    }
    const validProductExist = yield prisma.product.findUnique({
        where: { id: Number(data.id) },
    });
    if (!validProductExist) {
        throw new Error("El producto no existe");
    }
    const validUserExist = yield prisma.user.findUnique({
        where: { id: Number(idUser) },
    });
    if (!validUserExist || validUserExist.role_id !== 1) {
        throw new Error("El usuario no existe o no tiene permisos para realizar esta acción");
    }
    if (!data.name ||
        !data.category_id ||
        !data.price ||
        data.offert === undefined ||
        data.is_active === undefined ||
        !data.description) {
        throw new Error("Faltan datos obligatorios");
    }
    if (!mediaProducts || mediaProducts.length === 0 && !idsExist || idsExist.length === 0) {
        throw new Error("Se requieren imágenes");
    }
    try {
        const product = yield prisma.product.update({
            where: { id: Number(data.id) },
            data: Object.assign({}, data),
        });
        const existingMedia = yield prisma.productMedia.findMany({
            where: { product_id: product.id },
        });
        const newMedia = mediaProducts.filter((image) => image.id === 0);
        if (newMedia.length > 0) {
            yield prisma.productMedia.createMany({
                data: newMedia.map((image) => (Object.assign(Object.assign({}, image), { product_id: product.id, uploaded_at: new Date() }))),
            });
        }
        const mediaToDelete = existingMedia.filter((existing) => !idsExist.includes(existing.id));
        console.log(mediaToDelete);
        if (mediaToDelete.length > 0) {
            yield prisma.productMedia.deleteMany({
                where: {
                    id: {
                        in: mediaToDelete.map((media) => media.id),
                    },
                },
            });
        }
        const allDataProduct = {
            product,
        };
        return allDataProduct;
    }
    catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        throw new Error(error.message || "No se pudo actualizar el producto");
    }
});
exports.updateProduct = updateProduct;
const getStockProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const productWithStock = yield prisma.product.findUnique({
        where: { id: Number(id) },
        include: { inventory: true }
    });
    if (!productWithStock) {
        throw new Error("El producto no tiene stock");
    }
    return productWithStock;
});
exports.getStockProduct = getStockProduct;
const updateStockProduct = (id, id_user, stock, minimum_stock) => __awaiter(void 0, void 0, void 0, function* () {
    const productWithStock = yield prisma.inventory.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (!productWithStock) {
        throw new Error("El producto no tiene stock");
    }
    const stockAll = ((productWithStock === null || productWithStock === void 0 ? void 0 : productWithStock.stock) - stock) * -1;
    try {
        const updatedStock = yield prisma.inventory.update({
            where: {
                id: Number(id),
            },
            data: {
                stock,
                minimun_stock: minimum_stock
            },
        });
        const movementInventory = yield prisma.inventoryMovement.create({
            data: {
                user_id: id_user,
                product_id: updatedStock.product_id,
                quantity: stockAll,
                type: "entrada"
            },
        });
        return updatedStock;
    }
    catch (error) {
        console.error("Error al actualizar el stock del producto:", error.message);
        throw new Error(error.message || "No se pudo actualizar el stock del producto");
    }
});
exports.updateStockProduct = updateStockProduct;
const deleteProduct = (id, idUser) => __awaiter(void 0, void 0, void 0, function* () {
    const validProductExist = yield prisma.product.findUnique({
        where: { id: Number(id) },
    });
    if (!validProductExist) {
        throw new Error("El producto no existe");
    }
    const validUserExist = yield prisma.user.findUnique({
        where: { id: Number(idUser) },
    });
    if (!validUserExist || validUserExist.role_id !== 1) {
        throw new Error("El usuario no existe o no tiene permisos para realizar esta acción");
    }
    try {
        const product = yield prisma.product.update({
            where: { id },
            data: {
                deleted_at: new Date(),
            },
        });
        return product;
    }
    catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        throw new Error(error.message || "No se pudo eliminar el producto");
    }
});
exports.deleteProduct = deleteProduct;
