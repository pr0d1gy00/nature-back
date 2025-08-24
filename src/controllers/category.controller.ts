import { Request,Response,NextFunction } from "express";
import { createCategory,getCategoryById,getAllCategories,updateCategory,deleteCategory} from '../services/categoryService';
import {encryptId} from "../services/encryptedId";
import { decryptId } from "../services/encryptedId";

export const addCategory = async (req:Request, res:Response, next:NextFunction)=>{
	const {id_user, name, description} = req.body;
	const decryptedId = decryptId(id_user.toString());

	try {
		const newCategory = await createCategory({id_user:decryptedId, name, description});
		res.status(201).json({message:'Categoría creada exitosamente', category: newCategory});
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}

}
export const getCategory = async (req:Request, res:Response, next:NextFunction)=>{
	const categoryId = req.params.id;
	const decryptedId = decryptId(categoryId);
	try {
		const category = await getCategoryById(decryptedId);
		if (!category) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}
		const encryptedCategories = {
			...category,
			id: encryptId(category?.id.toString())
		}
		res.status(200).json({category: encryptedCategories});
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
}
export const getCategories = async (req:Request, res:Response, next:NextFunction)=>{
	try {
		const categories = await getAllCategories();
		if (!categories) {
			return res.status(404).json({ message: "No se encontraron categorías" });
		}
		const encryptedCategories = categories.map(category => ({
			...category,
			id: encryptId(category.id.toString())
		}));
		res.status(200).json({categories: encryptedCategories});
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
}
export const modifyCategory = async (req:Request, res:Response, next:NextFunction)=>{
	const {id_user, id, name, description} = req.body;
	const decryptedIdUser = decryptId(id_user.toString());
	const decryptedId = decryptId(id);
	try {
		const updatedCategory = await updateCategory({id_user: decryptedIdUser, id: parseInt(decryptedId), name, description});
		res.status(200).json({message:'Categoría modificada exitosamente', category: updatedCategory});
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}

}
export const removeCategory = async (req:Request, res:Response, next:NextFunction)=>{
	const {id,id_user} = req.params;
	const decryptedIdUser = decryptId(id_user.toString());
	const decryptedId = decryptId(id);
	try {
		await deleteCategory(decryptedId, parseInt(decryptedIdUser));
		res.status(200).json({message:'Categoría eliminada exitosamente'});
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
}
