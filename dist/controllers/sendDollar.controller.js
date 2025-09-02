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
exports.updateDollarCache = exports.getDollar = void 0;
const dolarScrapping_1 = __importDefault(require("../services/dolarScrapping"));
let lastDolar = {};
let isScraping = false;
const normalizeResult = (res) => {
    var _a, _b;
    if (!res)
        return { priceText: undefined, priceNumber: null };
    if (typeof res === "object")
        return {
            priceText: res.priceText,
            priceNumber: (_a = res.priceNumber) !== null && _a !== void 0 ? _a : null,
        };
    return {
        priceText: undefined,
        priceNumber: typeof res === "number" ? res : (_b = Number(res)) !== null && _b !== void 0 ? _b : null,
    };
};
const getDollar = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({ ok: true, dolar: lastDolar.priceNumber });
    }
    catch (err) {
        return res.status(500).json({ ok: false, message: "Error obteniendo dólar", error: String(err) });
    }
});
exports.getDollar = getDollar;
const updateDollarCache = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isScraping)
        return lastDolar;
    isScraping = true;
    try {
        const result = yield (0, dolarScrapping_1.default)();
        const normalized = normalizeResult(result);
        console.log('dsde normali', normalized);
        lastDolar = Object.assign(Object.assign({}, normalized), { updatedAt: new Date().toISOString() });
        return lastDolar;
    }
    finally {
        isScraping = false;
    }
});
exports.updateDollarCache = updateDollarCache;
