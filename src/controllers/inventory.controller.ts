import { Request,Response } from "express";
import { getInventory,getMovementInventory } from "../services/inventoryService";
import { uploadMediaOrderPayment, uploadMediaOrderShipment } from "../services/orderService";

export const getAllInventory = async (req: Request, res: Response) => {

		try {
			const inventory = await getInventory();
			return res.json({ message:"Inventarios Obtenidos", inventory });
		} catch (error:any) {
			console.error("Error fetching inventory:", error);
			res.status(400).json({ message: error.message });
		}
	}

export const getAllMovementsInventory = async (req: Request, res: Response) => {
		try {
			const movements = await getMovementInventory();
			return res.json({ message:"Movimientos de Inventario Obtenidos", movements });
		} catch (error:any) {
			console.error("Error fetching inventory movements:", error);
			res.status(400).json({ message: error.message });
		}
	}
export const addMediaShipment = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;
		const files = req.files as Express.Multer.File[];
		const mediaData = files.map((file, index) => ({
		url: `/uploads/${file.filename}`,
		type: file.mimetype.startsWith("image/")
			? ("image" as "image")
			: ("video" as "video"),
	}));
		await uploadMediaOrderShipment(Number(orderId), mediaData);
		return res.json({ message: "Medios de envío subidos correctamente" });
	} catch (error: any) {
		console.error("Error al subir medios de envío:", error);
		res.status(400).json({ message: error.message });
	}
};
export const addMediaPayment = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;
		const files = req.files as Express.Multer.File[];
		const mediaData = files.map((file, index) => ({
		url: `/uploads/${file.filename}`,
		type: file.mimetype.startsWith("image/")
			? ("image" as "image")
			: ("video" as "video"),
	}));
		await uploadMediaOrderPayment(Number(orderId), mediaData);
		return res.json({ message: "Medios de pago subidos correctamente" });
	} catch (error: any) {
		console.error("Error al subir medios de pago:", error);
		res.status(400).json({ message: error.message });
	}
};

