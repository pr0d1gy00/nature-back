import { Request, Response } from 'express';
import {
	createProduct,
	getProductById,
	getAllProducts,
	updateProduct,
	deleteProduct,
	getStockProduct,
	updateStockProduct,
} from "../services/productService";
import { decryptId, encryptId } from '../services/encryptedId';

export const addProduct = async (req: Request, res: Response) => {
	const {
		id_user,
		name,
		description,
		price,
		categoryId,
		offert,
		is_active,
		stock,
		minimum_stock,
	} = req.body;
	const decryptIdedUser = decryptId(id_user);
	const decryptedCategory = decryptId(categoryId);
	console.log(id_user)
	const files = req.files as Express.Multer.File[];

	const mediaData = files.map((file, index) => ({
		url: `/uploads/${file.filename}`,
		type: file.mimetype.startsWith("image/")
			? ("image" as "image")
			: ("video" as "video"),
	}));
	const data = {
		name,
		description,
		price,
		category_id: parseInt(decryptedCategory),
		offert: offert === "true" ? true : offert === true,
		is_active: is_active === "true" ? true : is_active === true
	};
	try {
		const newProduct = await createProduct(
			data,
			mediaData,
			parseInt(stock),
			parseInt(minimum_stock),
			parseInt(decryptIdedUser)
		);

		res.status(201).json({message:"Producto creado exitosamente", product:newProduct});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		const products = await getAllProducts();
		const productIdEncrypted = products.map(product=>({
			...product,
			id: encryptId(product.id.toString())
		}))
		res.status(200).json({ message: "Productos obtenidos exitosamente", products: productIdEncrypted });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};
export const modifyStockProduct = async (req:Request, res:Response)=>{
	const {id_user, id, stock, minimum_stock} = req.body;
	const idUserDecrypted = decryptId(id_user);
	console.log(id)

	try {
		const updatedStock = await updateStockProduct(
			parseInt(id),
			parseInt(idUserDecrypted),
			parseInt(stock),
			parseInt(minimum_stock)
		);
		res.status(200).json({ message: "Stock del producto modificado exitosamente", stock: updatedStock });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
}
export const getProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	const idDecrypted = decryptId(id);
	try {
		const product = await getProductById(parseInt(idDecrypted));
		const productEncrypted = {
			...product,
			id: encryptId(product.id.toString()),
			category_id: encryptId(product.category_id.toString()),
		};
		res.status(200).json({ message: "Producto obtenido exitosamente", product: productEncrypted });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};
export const modifyProduct = async (req: Request, res: Response) => {
	const { id_user,mediaIds, id, name, description, price, categoryId, offert, is_active, } = req.body;

	const idUserDecrypted = decryptId(id_user);
	const idDecrypted = decryptId(id);
	const decryptedCategory = decryptId(categoryId);
	const files = req.files as Express.Multer.File[];
	console.log("Files:", files);
	const IdsOfMedia = JSON.parse(mediaIds) as number[];
	console.log("IdsOfMedia:", IdsOfMedia);
	const mediaData = files.map((file, index) => ({
		id: 0,
		product_id: parseInt(idDecrypted),
		url: `/uploads/${file.filename}`,
		type: file.mimetype.startsWith("image/")
			? ("image" as "image")
			: ("video" as "video"),
	}));
	const data = {
		id: parseInt(idDecrypted),
		category_id: parseInt(decryptedCategory),
		name,
		description,
		price,
		offert: offert === "true" ? true : offert === true,
		is_active: is_active === "true" ? true : is_active === true
	};
	const mediaIdsFiltered = IdsOfMedia.filter(id => id !== 0);

	console.log("Filtered Media IDs:", mediaIdsFiltered);

	try {
		const updatedProduct = await updateProduct(
			data,
			mediaIdsFiltered,
			mediaData,
			parseInt(idUserDecrypted),
		);

		res.status(200).json({ message: "Producto modificado exitosamente", product: updatedProduct });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
}
export const getStockOfProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	const idDecrypted = decryptId(id);
	try {
		const stock = await getStockProduct(parseInt(idDecrypted));
		res.status(200).json({ message: "Stock del producto obtenido exitosamente", stock });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const removeProduct = async (req: Request, res: Response) => {
	const { id_user, id } = req.params;

	const idUserDecrypted = decryptId(id_user);
	const idDecrypted = decryptId(id);

	try {
		const deletedProduct = await deleteProduct(parseInt(idDecrypted), parseInt(idUserDecrypted));
		res.status(200).json({ message: "Producto eliminado exitosamente", product: deletedProduct });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};