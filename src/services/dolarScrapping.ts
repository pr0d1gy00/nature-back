import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

const scrapeDolarPrice = async () => {
	const isProd = process.env.NODE_ENV === "production";

	// Configuración de Puppeteer según el entorno
	const launchOptions: any = isProd
		? {
				args: chromium.args,
				defaultViewport: { width: 1920, height: 1080 },
				executablePath: await chromium.executablePath(),
				headless: true,
		  }
		: {
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

	const browser = await puppeteer.launch(launchOptions);
	const page = await browser.newPage();

	// User-Agent y cabeceras
	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
	);

	await page.setExtraHTTPHeaders({
		"accept-language": "es-VE,es;q=0.9,en;q=0.8",
	});

	// Scraping en BCV
	await page.goto("https://www.bcv.org.ve/", {
		waitUntil: "networkidle2",
	});
	await page.waitForSelector("#dolar .centrado strong", {
		timeout: 15000,
	});

	const priceText = await page.$eval(
		"#dolar .centrado strong",
		(el) => (el.textContent || "").trim()
	);

	const normalized = priceText
		.replace(/\s+/g, "")
		.replace(/\./g, "")
		.replace(",", ".");
	const priceNumber = Number.isFinite(Number(normalized))
		? parseFloat(normalized)
		: null;

	console.log("Precio Dólar BCV:", priceNumber);

	await browser.close();
	return priceNumber;
};

export default scrapeDolarPrice;
