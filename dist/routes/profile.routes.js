"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const router = (0, express_1.Router)();
router.get("/getInfoProfile", profile_controller_1.getUserProfile);
exports.default = router;
