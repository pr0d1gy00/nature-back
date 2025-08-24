import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductsToStore = async () => {
	try {
		const products = await prisma.product.findMany({
			where: {
				deleted_at: null,
			},
			include: {
				product_media: true,
				inventory: true,
			},
		});
		return products;
	} catch (error: any) {
		console.error(
			"Error al obtener los productos:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo obtener los productos"
		);
	}
};

export const getProductByFilters = async (filters: any) => {
	  try {
    // Validar y construir el filtro de precios
    const priceFilter =
      filters.price?.gte === 0 && filters.price?.lte === 0
        ? undefined // Si ambos son 0, no aplicar filtro
        : filters.price?.gte > filters.price?.lte
        ? undefined // Si el rango es inválido, no aplicar filtro
        : {
            gte: filters.price?.gte, // Precio mínimo
            lte: filters.price?.lte, // Precio máximo
          };

    // Validar y construir el filtro de categorías
    const categoryFilter =
      filters.category?.id && filters.category.id.length > 0
        ? {
            id: { in: filters.category.id }, // Filtrar por múltiples categorías
          }
        : undefined; // Si no hay categorías, no aplicar filtro

    const products = await prisma.product.findMany({
      where: {
        category: categoryFilter, // Aplicar filtro de categorías si existe
        price: priceFilter, // Aplicar filtro de precios si existe
        deleted_at: null, // Solo productos no eliminados
      },
      include: {
        product_media: true, // Incluir medios relacionados
        inventory: true, // Incluir inventario relacionado
      },
    });
		return products;
	} catch (error: any) {
		console.error(
			"Error al obtener los productos:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo obtener los productos"
		);
	}
};

export const getCategoriesToFiltersProducts = async () => {
	try {
		const categories = await prisma.category.findMany();
		return categories;
	} catch (error: any) {
		console.error(
			"Error al obtener las categorías:",
			error.message
		);
		throw new Error(
			error.message || "No se pudo obtener las categorías"
		);
	}
};
