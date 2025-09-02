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
exports.addMediaPayment = exports.addMediaShipment = exports.getAllMovementsInventory = exports.getAllInventory = void 0;
const inventoryService_1 = require("../services/inventoryService");
const orderService_1 = require("../services/orderService");
const getAllInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory = yield (0, inventoryService_1.getInventory)();
        return res.json({ message: "Inventarios Obtenidos", inventory });
    }
    catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(400).json({ message: error.message });
    }
});
exports.getAllInventory = getAllInventory;
const getAllMovementsInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movements = yield (0, inventoryService_1.getMovementInventory)();
        return res.json({ message: "Movimientos de Inventario Obtenidos", movements });
    }
    catch (error) {
        console.error("Error fetching inventory movements:", error);
        res.status(400).json({ message: error.message });
    }
});
exports.getAllMovementsInventory = getAllMovementsInventory;
const addMediaShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const files = req.files;
        const mediaData = files.map((file, index) => ({
            url: `/uploads/${file.filename}`,
            type: file.mimetype.startsWith("image/")
                ? "image"
                : "video",
        }));
        yield (0, orderService_1.uploadMediaOrderShipment)(Number(orderId), mediaData);
        return res.json({ message: "Medios de envío subidos correctamente" });
    }
    catch (error) {
        console.error("Error al subir medios de envío:", error);
        res.status(400).json({ message: error.message });
    }
});
exports.addMediaShipment = addMediaShipment;
const addMediaPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const files = req.files;
        const mediaData = files.map((file, index) => ({
            url: `/uploads/${file.filename}`,
            type: file.mimetype.startsWith("image/")
                ? "image"
                : "video",
        }));
        yield (0, orderService_1.uploadMediaOrderPayment)(Number(orderId), mediaData);
        return res.json({ message: "Medios de pago subidos correctamente" });
    }
    catch (error) {
        console.error("Error al subir medios de pago:", error);
        res.status(400).json({ message: error.message });
    }
});
exports.addMediaPayment = addMediaPayment;
