import { Request,Response } from "express";
import { getInventory,getMovementInventory } from "../services/inventoryService";

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

