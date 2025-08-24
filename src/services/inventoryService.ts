import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getInventory = async () => {
	try {
		const inventory = await prisma.inventory.findMany({
			include:{
				product: {
					include:{
						product_media: true,
					}
				}
			}
		});
		return inventory;
	} catch (error: any) {
		console.error(
			"Error al obtener todos los productos:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo obtener los productos"
		);
	}
};
export const getMovementInventory = async () => {
	try {
		const movements = await prisma.inventoryMovement.findMany({
			include:{
				product: {
					include:{
						product_media: true,
					}
				},
				user: true,

			}
		});
		return movements;
	} catch (error: any) {
		console.error(
			"Error al obtener todos los productos:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo obtener los productos"
		);
	}
};
