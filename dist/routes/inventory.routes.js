"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const router = (0, express_1.Router)();
router.get("/getInventory", inventory_controller_1.getAllInventory);
router.get("/getMovements", inventory_controller_1.getAllMovementsInventory);
exports.default = router;
