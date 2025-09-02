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
const puppeteer_1 = __importDefault(require("puppeteer"));
const scrapeDolarPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    const launchOptions = {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--window-size=1920,1080",
        ],
        defaultViewport: { width: 1920, height: 1080 },
    };
    const browser = yield puppeteer_1.default.launch(launchOptions);
    const page = yield browser.newPage();
    yield page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");
    yield page.setExtraHTTPHeaders({
        "accept-language": "es-VE,es;q=0.9,en;q=0.8",
    });
    yield page.goto("https://www.bcv.org.ve/", { waitUntil: "networkidle2" });
    yield page.waitForSelector("#dolar .centrado strong", { timeout: 15000 });
    const priceText = yield page.$eval("#dolar .centrado strong", (el) => (el.textContent || "").trim());
    const normalized = priceText
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    const priceNumber = Number.isFinite(Number(normalized))
        ? parseFloat(normalized)
        : null;
    console.log(priceNumber);
    yield browser.close();
    return priceNumber;
});
scrapeDolarPrice();
exports.default = scrapeDolarPrice;
