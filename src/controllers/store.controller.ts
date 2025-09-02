import { Request,Response } from "express";
import { getCategoriesToFiltersProducts, getProductByFilters, getProductByIdToStore, getProductsToStore,getProductsByName } from "../services/storeServices";
import { decryptId, encryptId } from "../services/encryptedId";

export const getProductsToShowStore = async (req: Request, res: Response) => {
	try {
		const products = await getProductsToStore();
		const productIdEncrypted = products.map(product=>({
			...product,
			id: encryptId(product.id.toString())
		}));
		res.status(200).json({ message:"Productos Obtenido", products: productIdEncrypted });
	} catch (error:any) {
		res.status(400).json({ message: error.message });

	}
}

export const getProductStore = async (req: Request, res: Response) => {
	const { product_id } = req.body;
	const idDecrypted = decryptId(product_id);
	console.log(idDecrypted)
	try {
		const {product, listProductRelated} = await getProductByIdToStore(parseInt(idDecrypted));
		const productEncrypted = {
			...product,
			id: encryptId(product.id.toString()),
			category_id: encryptId(product.category_id.toString()),
		};
		const listProductsEncrypted = listProductRelated.map((item) => ({
			...item,
			id: encryptId(item.id.toString()),
			category_id: encryptId(item.category_id.toString()),
		}));
		res.status(200).json({ message: "Producto obtenido exitosamente", product: productEncrypted, listProducts: listProductsEncrypted });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const getProductsByFilters = async (req: Request, res: Response) => {
	const {filters} = req.body;
	console.log(filters)
	try {
		const products = await getProductByFilters(filters);
		const productIdEncrypted = products.map(product=>({
			...product,
			id: encryptId(product.id.toString())
		}));
		console.log(productIdEncrypted)
		res.status(200).json({ message: "Productos Obtenidos", products: productIdEncrypted });
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
};

export const getProductsByNameController = async (req: Request, res: Response) => {
	const { nameProductSearch } = req.params;
	try {
		const products = await getProductsByName(nameProductSearch);
		if(!products || products.length === 0) {
			return res.status(404).json({ message: "No se encontraron productos" });
		}
		const productIdEncrypted =  products.map(product => ({
			...product,
			id: encryptId(product.id.toString())
		}));
		res.status(200).json({ message: "Productos Obtenidos", products: productIdEncrypted });
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
