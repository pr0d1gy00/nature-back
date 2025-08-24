import { Request,Response } from "express";
import { getCategoriesToFiltersProducts, getProductByFilters, getProductsToStore } from "../services/storeServices";

export const getProductsToShowStore = async (req: Request, res: Response) => {
	try {
		const products = await getProductsToStore();
		res.status(200).json({ message:"Productos Obtenido", products });
	} catch (error:any) {
		res.status(400).json({ message: error.message });

	}
}

export const getProductsByFilters = async (req: Request, res: Response) => {
	const {filters} = req.body;
	console.log(filters)
	try {
		const products = await getProductByFilters(filters);
		res.status(200).json({ message: "Productos Obtenidos", products });
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
};

export const getCategoriesForFilters = async (req: Request, res: Response) => {
	try {
		const categories = await getCategoriesToFiltersProducts();
		res.status(200).json({ message: "Categorías Obtenidas", categories });
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
};
