import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ProductProps {
	id: number;
	category_id: number;
	name: string;
	description?: string;
	price: number;
	offert: boolean;
	is_active: boolean;
}
export interface mediaProductsProps {
	id?: number;
	product_id: number;
	type: "image" | "video";
	url: string;
}
export type ProductMediaPropsWithoutId = Omit<
	mediaProductsProps,
	"id" | "product_id"
>;
export type CreateProductProps = Omit<ProductProps, "id">;

export const createProduct = async (
	data: CreateProductProps,

	mediaProducts: ProductMediaPropsWithoutId[],
	stock: number,
	minimum_stock: number,
	idUser: number
) => {
	if (
		!data.name ||
		!data.category_id ||
		!data.price ||
		data.offert === undefined ||
		data.is_active === undefined ||
		!data.description
	) {
		throw new Error(
			"Faltan datos obligatorios para crear el producto"
		);
	}
	if (!mediaProducts || mediaProducts.length === 0) {
		throw new Error(
			"Se requieren imágenes para crear el producto"
		);
	}
	if (!stock || stock <= 0) {
		throw new Error(
			"El stock es obligatorio y debe ser mayor que cero"
		);
	}
	const validUserExist = await prisma.user.findUnique({
		where: { id: Number(idUser) },
	});
	if (!validUserExist || validUserExist.role_id !== 1) {
		throw new Error(
			"El usuario no existe o no tiene permisos para realizar esta acción"
		);
	}
	try {
		const product = await prisma.product.create({
			data: {
				...data,
				is_active:true
			},
		});
		const productMedia = await prisma.productMedia.createMany({
			data: mediaProducts.map((image) => ({
				...image,
				product_id: product.id,
				uploaded_at: new Date(),
			})),
		});
		const productStock = await prisma.inventory.create({
			data: {
				product_id: product.id,
				stock: stock,
				minimun_stock: minimum_stock,
			},
		});
		const movementInventory =
			await prisma.inventoryMovement.create({
				data: {
					user_id: idUser,
					product_id: product.id,
					quantity: stock,
					type: "entrada",
					created_at: new Date(),
				},
			});
		const allDataProduct = {
			product,
			productMedia,
			productStock,
			movementInventory,
		};
		return allDataProduct;
	} catch (error: any) {
		console.error("Error al crear el producto:", error.message);
		throw new Error(
			error.message || "No se pudo crear el producto"
		);
	}
};

export const getAllProducts = async () => {
	try {
		const products = await prisma.product.findMany({
			where: {
				deleted_at: null,
			},
			include:{
				product_media: true,
				inventory: true
			}
		});
		return products;
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

export const getProductById = async (id: number) => {
	try {
		const product = await prisma.product.findUnique({
			where: {
				id: Number(id),
				AND: {
					deleted_at: null,
				},

			},
			include:{
				product_media: true,
			}
		});
		if (!product) {
			throw new Error("El producto no existe");
		}
		return product;
	} catch (error: any) {
		console.error("Error al obtener el producto:", error.message);
		throw new Error(
			error.message || "No se pudo obtener el producto"
		);
	}
};
export const updateProduct = async (
	data: ProductProps,
	idsExist: number[],
	mediaProducts: mediaProductsProps[],
	idUser: number
) => {
	if (!data.id) {
		throw new Error("El ID del producto es obligatorio");
	}
	const validProductExist = await prisma.product.findUnique({
		where: { id: Number(data.id) },
	});
	if (!validProductExist) {
		throw new Error("El producto no existe");
	}
	const validUserExist = await prisma.user.findUnique({
		where: { id: Number(idUser) },
	});
	if (!validUserExist || validUserExist.role_id !== 1) {
		throw new Error(
			"El usuario no existe o no tiene permisos para realizar esta acción"
		);
	}
	if (
		!data.name ||
		!data.category_id ||
		!data.price ||
		data.offert === undefined ||
		data.is_active === undefined ||
		!data.description
	) {
		throw new Error("Faltan datos obligatorios");
	}
	if (!mediaProducts || mediaProducts.length === 0 && !idsExist || idsExist.length === 0) {
		throw new Error("Se requieren imágenes");
	}

	try {
		const product = await prisma.product.update({
			where: { id: Number(data.id) },
			data: {
				...data,
			},
		});

		const existingMedia = await prisma.productMedia.findMany({
			where: { product_id: product.id },
		});
		const newMedia = mediaProducts.filter((image) => image.id === 0);

		if (newMedia.length > 0) {
			await prisma.productMedia.createMany({
				data: newMedia.map((image) => ({
					...image,
					product_id: product.id,
					uploaded_at: new Date(),
				})),
			});
		}


		const mediaToDelete = existingMedia.filter(
			(existing) => !idsExist.includes(existing.id)
		);
		console.log(mediaToDelete)

		if (mediaToDelete.length > 0) {
			await prisma.productMedia.deleteMany({
				where: {
					id: {
						in: mediaToDelete.map((media) => media.id),
					},
				},
			});
		}
		const allDataProduct = {
			product,
		};
		return allDataProduct;
	} catch (error: any) {
		console.error(
			"Error al actualizar el producto:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo actualizar el producto"
		);
	}
};

export const getStockProduct = async (id: number) => {
	const productWithStock = await prisma.product.findUnique({
		where: { id: Number(id) },
		include:{inventory: true}
	});
	if (!productWithStock) {
		throw new Error("El producto no tiene stock");
	}
	return productWithStock;
};

export const updateStockProduct = async (id: number, id_user: number, stock: number, minimum_stock: number) => {
	const productWithStock = await prisma.inventory.findUnique({
		where: {
			id: Number(id),
		},
	});
	if (!productWithStock) {
		throw new Error("El producto no tiene stock");
	}
	const stockAll = (productWithStock?.stock - stock) * -1
	try {
		const updatedStock = await prisma.inventory.update({
			where: {
				id: Number(id),
			},
			data: {
				stock,
				minimun_stock: minimum_stock
			},
		});
		const movementInventory = await prisma.inventoryMovement.create({
			data: {
				user_id: id_user,
				product_id: updatedStock.product_id,
				quantity: stockAll,
				type: "entrada"
			},
		});
		return updatedStock;
	} catch (error: any) {
		console.error(
			"Error al actualizar el stock del producto:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo actualizar el stock del producto"
		);
	}
}

export const deleteProduct = async (id: number, idUser: number) => {
	const validProductExist = await prisma.product.findUnique({
		where: { id: Number(id) },
	});
	if (!validProductExist) {
		throw new Error("El producto no existe");
	}
	const validUserExist = await prisma.user.findUnique({
		where: { id: Number(idUser) },
	});
	if (!validUserExist || validUserExist.role_id !== 1) {
		throw new Error(
			"El usuario no existe o no tiene permisos para realizar esta acción"
		);
	}
	try {
		const product = await prisma.product.update({
			where: { id },
			data: {
				deleted_at: new Date(),
			},
		});
		return product;
	} catch (error: any) {
		console.error(
			"Error al eliminar el producto:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo eliminar el producto"
		);
	}
};
