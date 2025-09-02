"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sendDollar_controller_1 = require("../controllers/sendDollar.controller");
const router = (0, express_1.Router)();
router.get("/getPriceDolar", sendDollar_controller_1.getDollar);
exports.default = router;
