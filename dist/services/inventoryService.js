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
exports.getMovementInventory = exports.getInventory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getInventory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory = yield prisma.inventory.findMany({
            include: {
                product: {
                    include: {
                        product_media: true,
                    }
                }
            }
        });
        return inventory;
    }
    catch (error) {
        console.error("Error al obtener todos los productos:", error.message);
        throw new Error(error.message || "No se pudo obtener los productos");
    }
});
exports.getInventory = getInventory;
const getMovementInventory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movements = yield prisma.inventoryMovement.findMany({
            include: {
                product: {
                    include: {
                        product_media: true,
                    }
                },
                user: true,
            }
        });
        return movements;
    }
    catch (error) {
        console.error("Error al obtener todos los productos:", error.message);
        throw new Error(error.message || "No se pudo obtener los productos");
    }
});
exports.getMovementInventory = getMovementInventory;
