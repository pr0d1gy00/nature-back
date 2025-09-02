import { Request, Response } from "express";
import scrapeDolarPrice from "../services/dolarScrapping";

let lastDolar: {
	priceText?: string;
	priceNumber?: number | null;
	updatedAt?: string;
} = {};
let isScraping = false;

const normalizeResult = (res: any) => {
	if (!res) return { priceText: undefined, priceNumber: null };
	if (typeof res === "object")
		return {
			priceText: res.priceText,
			priceNumber: res.priceNumber ?? null,
		};
	return {
		priceText: undefined,
		priceNumber:
			typeof res === "number" ? res : Number(res) ?? null,
	};
};

export const getDollar = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, dolar: lastDolar.priceNumber });
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: "Error obteniendo dólar", error: String(err) });
  }
};

export const updateDollarCache = async (): Promise<typeof lastDolar> => {
  if (isScraping) return lastDolar;
  isScraping = true;
  try {
    const result = await scrapeDolarPrice();
    const normalized = normalizeResult(result);
    console.log('dsde normali',normalized);
    lastDolar = { ...normalized, updatedAt: new Date().toISOString() };
    return lastDolar;
  } finally {
    isScraping = false;
  }
};