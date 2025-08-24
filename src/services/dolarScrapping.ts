import puppeteer from "puppeteer";

const scrapeDolarPrice = async () => {
	const launchOptions: any = {
		headless: false,
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
	await page.goto("https://www.bcv.org.ve/", { waitUntil: "domcontentloaded" });
	//await page.waitForSelector("#dolar .centrado strong", { timeout: 10000 });
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
	console.log(priceNumber);
	await browser.close();
	return priceNumber;
};
scrapeDolarPrice();
export default scrapeDolarPrice;
