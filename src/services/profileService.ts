import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllInfoUserById = async (user_id: number) => {
	try {
		return await prisma.user.findUnique({
			where: { id: user_id },

			include: {
				orders: {
					include: {
						order_products: {
							include: {
								product: {
									include: {
										product_media: true,
									},
								},
							},
						},
						order_media: true,
					},
					orderBy: {
						created_at: "desc",
					},
				},
			},
		});
	} catch (error: any) {
		console.error("Error al obtener la información del usuario:", error.message);
		throw new Error(
			error.message || "No se pudo obtener la información del usuario"
		);
	}
};
