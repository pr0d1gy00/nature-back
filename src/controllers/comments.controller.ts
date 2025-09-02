import e, { Request, Response } from "express";
import {createComment,getCommentsByProductId,getAllComments,deleteComment,updateComment, getCalifications} from '../services/commentsService';
import { decryptId } from "../services/encryptedId";

export const createCommentController = async (req: Request, res: Response) => {
	const { user_id, product_id, calification_id, content } = req.body;
	console.log(
		`Creando comentario para el usuario ${user_id} en el producto ${product_id}, con calificación ${calification_id} y contenido: ${content}`
	)
	const idUserDecrypted = decryptId(user_id)
	const productDecrypted = decryptId(product_id)
	try {
		const comment = await createComment({ user_id:parseInt(idUserDecrypted), product_id:parseInt(productDecrypted), calification_id, content });
		res.status(201).json({ message: "Comentario creado con éxito", comment });
	} catch (error:any) {
		res.status(400).json({ error: error.message });
	}
}
export const getCommentsByProductIdController = async (req: Request, res: Response) => {
	const { product_id } = req.params;
		const productDecrypted = decryptId(product_id)
		
	try {
		const comments = await getCommentsByProductId(Number(productDecrypted));
		res.status(200).json(comments);
	} catch (error:any) {
		res.status(400).json({ error: error.message });
	}
}

export const getAllCommentsController = async (_req: Request, res: Response) => {
	try {
		const comments = await getAllComments();
		res.status(200).json(comments);
	} catch (error:any) {
		res.status(400).json({ error: error.message });
	}
}
export const getAllCalificationsController = async (_req: Request, res: Response) => {
	try {
		const califications = await getCalifications();
		res.status(200).json(califications);
	} catch (error:any) {
		res.status(400).json({ error: error.message });
	}
}

export const deleteCommentController = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await deleteComment(Number(id));
		res.status(200).json(result);
	} catch (error:any) {
		res.status(400).json({ error: error.message });
	}
}

export const updateCommentController = async (req: Request, res: Response) => {
	const { id, data } = req.body;
	try {
		const updatedComment = await updateComment(Number(id), data);
		res.status(200).json(updatedComment);
	} catch (error:any) {
		res.status(400).json({ error: error.message });
	}
}
