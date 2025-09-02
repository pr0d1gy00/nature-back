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
exports.getOrdersByStatus = exports.changesOrderStatus = exports.uploadMediaOrderPayment = exports.uploadMediaOrderShipment = exports.getOrderByUserId = exports.getOrderById = exports.getAllOrders = exports.createOrderByUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrderByUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user_id, address, data, }) {
    try {
        const validUserExist = yield prisma.user.findUnique({
            where: { id: Number(user_id) },
        });
        const productIds = data.map((product) => product.product_id);
        const ProductWithQuantities = data.filter((item) => item.quantity === 0);
        if (ProductWithQuantities.length > 0) {
            throw new Error("La cantidad de productos no puede ser cero");
        }
        if (!data || data.length === 0) {
            throw new Error("No se han proporcionado productos");
        }
        const existingProducts = yield prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        const totalPrice = existingProducts.reduce((total, product) => {
            var _a, _b;
            const productPrice = typeof product.price === "string"
                ? parseFloat(product.price)
                : Number(product.price);
            const quantity = (_b = (_a = data.find((item) => item.product_id === product.id)) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 0;
            return total + productPrice * quantity;
        }, 0);
        if (existingProducts.length !== productIds.length) {
            throw new Error("Algunos productos no existen");
        }
        if (!validUserExist) {
            throw new Error("El usuario no existe");
        }
        const order = yield prisma.order.create({
            data: {
                user_id: Number(user_id),
                address,
                status: "pendiente",
                total: totalPrice,
            },
        });
        const orderItems = data.map((item) => {
            var _a;
            return ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: ((_a = existingProducts.find((p) => p.id === item.product_id)) === null || _a === void 0 ? void 0 : _a.price) || 0,
            });
        });
        yield prisma.ordersProducts.createMany({
            data: orderItems,
        });
        // Aquí puedes realizar cualquier otra acción necesaria después de crear la orden
        const dataToResponseController = existingProducts.map((product) => {
            var _a;
            const item = orderItems.find((orderItem) => orderItem.product_id === product.id);
            return Object.assign(Object.assign(Object.assign({}, product), orderItems.find((item) => item.product_id === product.id)), { quantity: (_a = item === null || item === void 0 ? void 0 : item.quantity) !== null && _a !== void 0 ? _a : 0 });
        });
        return {
            order,
            orderItems,
            existingProducts,
            dataToResponseController,
        };
    }
    catch (error) {
        console.error("Error al crear la compra:", error.message);
        throw new Error(error.message || "No se pudo crear la compra");
    }
});
exports.createOrderByUser = createOrderByUser;
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.order.findMany({
        include: {
            user: true,
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
            status: "asc",
        },
    });
});
exports.getAllOrders = getAllOrders;
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
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
        });
    }
    catch (error) {
        console.error("Error al obtener la orden:", error.message);
        throw new Error(error.message || "No se pudo obtener la orden");
    }
});
exports.getOrderById = getOrderById;
const getOrderByUserId = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.order.findMany({
            where: { user_id },
            include: {
                user: true,
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
        });
    }
    catch (error) {
        console.error("Error al subir medios de envío:", error.message);
        throw new Error(error.message || "No se pudo subir los medios de envío");
    }
});
exports.getOrderByUserId = getOrderByUserId;
const uploadMediaOrderShipment = (orderId, mediaData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield tx.order.findUnique({
                where: { id: orderId },
            });
            if (!order)
                throw new Error("Orden no encontrada");
            const orderMedia = yield tx.orderMedia.createMany({
                data: mediaData.map((file) => (Object.assign(Object.assign({}, file), { order_id: orderId, url: file.url, alt_text: "Envio", uploaded_at: new Date() }))),
            });
            const updatedOrder = yield tx.order.update({
                where: { id: orderId },
                data: {
                    status: "enviado",
                    updated_at: new Date(),
                },
            });
            return orderMedia;
        }));
    }
    catch (error) {
        console.error("Error al subir medios de envío:", error.message);
        throw new Error(error.message || "No se pudo subir los medios de envío");
    }
});
exports.uploadMediaOrderShipment = uploadMediaOrderShipment;
const uploadMediaOrderPayment = (orderId, mediaData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield tx.order.findUnique({
                where: { id: orderId },
            });
            if (!order)
                throw new Error("Orden no encontrada");
            const orderMedia = yield tx.orderMedia.createMany({
                data: mediaData.map((file) => (Object.assign(Object.assign({}, file), { order_id: orderId, url: file.url, alt_text: "Pago", uploaded_at: new Date() }))),
            });
            const updatedOrder = yield tx.order.update({
                where: { id: orderId },
                data: {
                    status: "pagado",
                    updated_at: new Date(),
                },
            });
            return orderMedia;
        }));
    }
    catch (error) {
        console.error("Error al subir medios de envío:", error.message);
        throw new Error(error.message || "No se pudo subir los medios de envío");
    }
});
exports.uploadMediaOrderPayment = uploadMediaOrderPayment;
const changesOrderStatus = (orderId, userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield tx.order.findUnique({
            where: { id: orderId },
            include: {
                order_products: true,
            },
        });
        if (!order) {
            throw new Error("La orden no existe");
        }
        const currentStatus = order.status;
        if (currentStatus === status) {
            return order;
        }
        let promises = [];
        // CASO 1: Se confirma la compra (Pasa a 'pagado' o 'enviado' desde 'pendiente')
        // -> Descontar del inventario Y REGISTRAR EL MOVIMIENTO.
        if ((status === "pagado" || status === "enviado") &&
            currentStatus === "pendiente") {
            for (const item of order.order_products) {
                // Promesa para descontar el stock
                promises.push(tx.inventory.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                }));
                promises.push(tx.inventoryMovement.create({
                    data: {
                        product_id: item.product_id,
                        order_id: orderId,
                        user_id: userId,
                        quantity: item.quantity,
                        type: "salida",
                        reason: "Venta",
                    },
                }));
            }
        }
        // CASO 2: Se cancela una compra que ya había sido confirmada (pagada o enviada)
        // -> Revertir el inventario (rollback) Y REGISTRAR EL MOVIMIENTO DE ENTRADA.
        if (status === "cancelado" &&
            (currentStatus === "pagado" ||
                currentStatus === "enviado")) {
            for (const item of order.order_products) {
                // Promesa para devolver el stock
                promises.push(tx.inventory.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                }));
                // Promesa para crear el registro del movimiento de inventario (devolución)
                promises.push(tx.inventoryMovement.create({
                    data: {
                        product_id: item.product_id,
                        order_id: orderId,
                        user_id: userId,
                        quantity: item.quantity,
                        type: "ajuste",
                        reason: "Cancelación/Devolución de Venta",
                    },
                }));
            }
        }
        yield Promise.all(promises);
        const updatedOrder = yield tx.order.update({
            where: { id: orderId },
            data: { status: status },
        });
        return updatedOrder;
    }));
});
exports.changesOrderStatus = changesOrderStatus;
const getOrdersByStatus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ status, }) {
    try {
        return yield prisma.order.findMany({
            where: {
                status,
            },
            include: {
                user: true,
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
        });
    }
    catch (error) {
        console.error("Error al obtener las órdenes:", error.message);
        throw new Error(error.message || "No se pudo obtener las órdenes");
    }
});
exports.getOrdersByStatus = getOrdersByStatus;
