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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const sendDollar_controller_1 = require("../controllers/sendDollar.controller");
// expresión cron configurable via env (default: cada hora en minuto 0)
const CRON_EXPR = process.env.DOLAR_CRON || "0 * * * *";
(() => __awaiter(void 0, void 0, void 0, function* () {
    // run once at startup (non-blocking)
    try {
        yield (0, sendDollar_controller_1.updateDollarCache)();
        console.log("Initial dollar cache populated");
    }
    catch (e) {
        console.error("Initial dollar cache error:", e);
    }
}))();
node_cron_1.default.schedule(CRON_EXPR, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Scheduled dollar update:", new Date().toISOString());
    try {
        yield (0, sendDollar_controller_1.updateDollarCache)();
        console.log("Dollar cache updated");
    }
    catch (e) {
        console.error("Scheduled update failed:", e);
    }
}));
