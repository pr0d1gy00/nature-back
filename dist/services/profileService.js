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
exports.getAllInfoUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllInfoUserById = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findUnique({
            where: { id: user_id },
            include: {
                orders: {
                    include: {
                        order_products: {
                            include: {
                                product: {
                                    include: {
                                        product_media: true,
                                    },
                                },
                            },
                        },
                        order_media: true,
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                },
            },
        });
    }
    catch (error) {
        console.error("Error al obtener la información del usuario:", error.message);
        throw new Error(error.message || "No se pudo obtener la información del usuario");
    }
});
exports.getAllInfoUserById = getAllInfoUserById;
