import { PrismaClient } from "@prisma/client";
import { ProductMediaPropsWithoutId } from "./productService";

const prisma = new PrismaClient();

interface CreateOrderProps {
	user_id: string;
	address: string;
	data: {
		product_id: number;
		quantity: number;
	}[];
}

export const createOrderByUser = async ({
	user_id,
	address,
	data,
}: CreateOrderProps) => {
	try {
		const validUserExist = await prisma.user.findUnique({
			where: { id: Number(user_id) },
		});
		const productIds = data.map((product) => product.product_id);
		const ProductWithQuantities = data.filter(
			(item) => item.quantity === 0
		);
		if (ProductWithQuantities.length > 0) {
			throw new Error(
				"La cantidad de productos no puede ser cero"
			);
		}
		if (!data || data.length === 0) {
			throw new Error("No se han proporcionado productos");
		}
		console.log(data)
		const existingProducts = await prisma.product.findMany({
			where: {
				id: {
					in: productIds,
				},
			},
		});
		const totalPrice = existingProducts.reduce(
			(total, product) => {
				const productPrice =
					typeof product.price === "string"
						? parseFloat(product.price)
						: Number(product.price);
				const quantity =
					data.find(
						(item) => item.product_id === product.id
					)?.quantity ?? 0;
				return total + productPrice * quantity;
			},
			0
		);
		if (existingProducts.length !== productIds.length) {
			throw new Error("Algunos productos no existen");
		}
		if (!validUserExist) {
			throw new Error("El usuario no existe");
		}
		const validateStock = await Promise.all(
			data.map(async (item) => {
				const inventory = await prisma.inventory.findUnique({
					where: { product_id: item.product_id },
				});
				if (!inventory) {
					throw new Error(
						`No se encontró inventario para el producto con ID: ${item.product_id}`
					);
				}
				if (inventory.stock < item.quantity) {
					throw new Error(
						`No hay suficiente stock para uno o más productos de los que quieres comprar`
					);
				}
				return true;
			}
		))
		if (validateStock.includes(false)) {
			throw new Error(
				"No hay suficiente stock para uno o más productos"
			);
		}
		const order = await prisma.order.create({
			data: {
				user_id: Number(user_id),
				address,
				status: "pendiente",
				total: totalPrice,
			},
		});

		const orderItems = data.map((item) => ({
			order_id: order.id,
			product_id: item.product_id,
			quantity: item.quantity,
			price:
				existingProducts.find((p) => p.id === item.product_id)
					?.price || 0,
		}));

		await prisma.ordersProducts.createMany({
			data: orderItems,
		});
		// Aquí puedes realizar cualquier otra acción necesaria después de crear la orden
		const dataToResponseController = existingProducts.map(
			(product) => {
				const item = orderItems.find(
					(orderItem) => orderItem.product_id === product.id
				);
				return {
					...product,
					...orderItems.find(
						(item) => item.product_id === product.id
					),
					quantity: item?.quantity ?? 0,
				};
			}
		);
		return {
			order,
			orderItems,
			existingProducts,
			dataToResponseController,
		};
	} catch (error: any) {
		console.error("Error al crear la compra:", error.message);
		throw new Error(
			error.message || "No se pudo crear la compra"
		);
	}
};

export const getAllOrders = async () => {
	return await prisma.order.findMany({
		include: {
			user: true,
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
			status: "asc",
		},
	});
};
export const getOrderById = async (id: number) => {
	try {
		return await prisma.order.findUnique({
			where: { id },
			include: {
				user: true,
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
		});
	} catch (error: any) {
		console.error("Error al obtener la orden:", error.message);
		throw new Error(
			error.message || "No se pudo obtener la orden"
		);
	}
};
export const getOrderByUserId = async (user_id: number) => {
	try {
		return await prisma.order.findMany({
			where: { user_id },
			include: {
				user: true,
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
		});
	} catch (error:any) {
		console.error(
			"Error al subir medios de envío:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo subir los medios de envío"
		);
	}
}

export const uploadMediaOrderShipment = async (
	orderId: number,
	mediaData: Omit<ProductMediaPropsWithoutId, "type">[]
) => {
	try {
		return await prisma.$transaction(async (tx) => {
			const order = await tx.order.findUnique({
				where: { id: orderId },
			});
			if (!order) throw new Error("Orden no encontrada");

		const orderMedia = await tx.orderMedia.createMany({
			data: mediaData.map((file) => ({
				...file,
				order_id: orderId,
				url: file.url,
				alt_text: "Envio",
				uploaded_at: new Date(),
			})),
		});

		const updatedOrder = await tx.order.update({
			where: { id: orderId },
			data: {
				status: "enviado",
				updated_at: new Date(),
			},
		});
		return orderMedia;
	})
	} catch (error: any) {
		console.error(
			"Error al subir medios de envío:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo subir los medios de envío"
		);
	}
};
export const uploadMediaOrderPayment = async (
	orderId: number,
	mediaData: Omit<ProductMediaPropsWithoutId, "type">[]
) => {
	try {
		const productsOrder = await prisma.ordersProducts.findMany({
			where: { order_id: orderId },
		})
		if(productsOrder.length === 0) throw new Error("No se encontraron productos en la orden");
		const productHaveStock = await Promise.all(productsOrder.map(async (item)=>{
			const inventory = await prisma.inventory.findUnique({
				where: { product_id: item.product_id },
			});
			if(!inventory) throw new Error("No se encontró inventario para el producto con ID: " + item.product_id);
			if(inventory.stock < item.quantity) throw new Error("No hay suficiente stock para uno o más productos de los que quieres comprar");
			return true;
		}	));
		if(productHaveStock.includes(false)) throw new Error("No hay suficiente stock para uno o más productos en la orden");

		return await prisma.$transaction(async (tx) => {

			const order = await tx.order.findUnique({
				where: { id: orderId },
			});
			if (!order) throw new Error("Orden no encontrada");

			const orderMedia = await tx.orderMedia.createMany({
				data: mediaData.map((file) => ({
					...file,
					order_id: orderId,
					url: file.url,
					alt_text: "Pago",
					uploaded_at: new Date(),
				})),
			});

			const updatedOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					status: "pagado",
					updated_at: new Date(),
				},
			});

			const updateInventory = await Promise.all(productsOrder.map(
				async (item) =>{
					const inventory = await tx.inventory.update({
						where: { product_id: item.product_id },
						data: {
							stock: {
								decrement: item.quantity,
							},
						},
					});
				}
				)
			)

		return orderMedia;
	}) }catch (error: any) {
		console.error(
			"Error al subir medios de envío:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo subir los medios de envío"
		);
	}
};

export const changesOrderStatus = async (
	orderId: number,
	userId: number,
	status: "pendiente" | "pagado" | "enviado" | "cancelado"
) => {
	return await prisma.$transaction(async (tx) => {
		const order = await tx.order.findUnique({
            where: { id: orderId },
            include: {
                order_products: true,
            },
        });

        if (!order) {
            throw new Error("La orden no existe");
        }

        const currentStatus = order.status;

        if (currentStatus === status) {
            return order;
        }

        let promises: Promise<any>[] = [];

        // CASO 1: Se confirma la compra (Pasa a 'pagado' o 'enviado' desde 'pendiente')
        // -> Descontar del inventario Y REGISTRAR EL MOVIMIENTO.
        if (
            (status === "pagado" || status === "enviado") &&
            currentStatus === "pendiente"
        ) {
            for (const item of order.order_products) {
                // Promesa para descontar el stock
                promises.push(
                    tx.inventory.update({
                        where: { product_id: item.product_id },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    })
                );

				promises.push(
					tx.inventoryMovement.create({
						data: {
							product_id: item.product_id,
							order_id: orderId,
							user_id: userId,
							quantity: item.quantity,
							type: "salida",
							reason: "Venta",
						},
					})
				);
			}
		}

		// CASO 2: Se cancela una compra que ya había sido confirmada (pagada o enviada)
		// -> Revertir el inventario (rollback) Y REGISTRAR EL MOVIMIENTO DE ENTRADA.
		if (
			status === "cancelado" &&
			(currentStatus === "pagado" ||
				currentStatus === "enviado")
		) {
			for (const item of order.order_products) {
				// Promesa para devolver el stock
				promises.push(
					tx.inventory.update({
						where: { product_id: item.product_id },
						data: {
							stock: {
								increment: item.quantity,
							},
						},
					})
				);

				// Promesa para crear el registro del movimiento de inventario (devolución)
				promises.push(
					tx.inventoryMovement.create({
						data: {
							product_id: item.product_id,
							order_id: orderId,
							user_id: userId,
							quantity: item.quantity,
							type: "ajuste",
							reason: "Cancelación/Devolución de Venta",
						},
					})
				);
			}
		}

		await Promise.all(promises);

		const updatedOrder = await tx.order.update({
			where: { id: orderId },
			data: { status: status },
		});

		return updatedOrder;
	});
};

export const getOrdersByStatus = async ({
	status,
}: {
	status: "pendiente" | "pagado" | "enviado" | "cancelado";
}) => {
	try {
		return await prisma.order.findMany({
			where: {
				status,
			},
			include: {
				user: true,
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
		});
	} catch (error: any) {
		console.error("Error al obtener las órdenes:", error.message);
		throw new Error(
			error.message || "No se pudo obtener las órdenes"
		);
	}
};
