import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Createcomments{
	user_id:number
	product_id:number
	calification_id:number
	content:string
}
export const createComment = async (data: Createcomments) => {
	try {
		const validUserExist = await prisma.user.findUnique({
			where: { id: Number(data.user_id) }
		})
		if (!validUserExist) {
			throw new Error("Usuario no válido");
		}
		const comment = await prisma.comments.create({
			data
		});
		return comment;
	} catch (error:any) {
		console.error("Error al crear el comentario:", error.message);
		throw new Error(
			error.message || "No se pudo crear el comentario"
		);
	}
}
export const getCommentsByProductId = async (product_id:number) => {
	try {
		const validProductExist = await prisma.product.findUnique({
			where: { id: Number(product_id) }
		});
		if (!validProductExist) {
			throw new Error("Producto no válido");
		}
		const comments = await prisma.comments.findMany({
			where: { product_id: Number(product_id) },
			include:{
				user:{
					select:{
						name:true
					}
				},
				calification:true
			}
		});
		return comments;
	} catch (error:any) {
		console.error("Error al obtener los comentarios:", error.message);
		throw new Error(
			error.message || "No se pudo obtener los comentarios"
		);
	}
}

export const getAllComments = async () => {
	try {
		const comments = await prisma.comments.findMany();
		return comments;
	} catch (error:any) {
		console.error("Error al obtener todos los comentarios:", error.message);
		throw new Error(
			error.message || "No se pudo obtener todos los comentarios"
		);
	}
}

export const deleteComment = async (id:number) => {
	try {
		const validCommentExist = await prisma.comments.findUnique({
			where: { id: Number(id) }
		});
		if (!validCommentExist) {
			throw new Error("Comentario no válido");
		}
		await prisma.comments.delete({
			where: { id: Number(id) }
		});
		return { message: "Comentario eliminado con éxito" };
	} catch (error:any) {
		console.error("Error al eliminar el comentario:", error.message);
		throw new Error(
			error.message || "No se pudo eliminar el comentario"
		);
	}
}
export const getCalifications = async () => {
	const califications = await prisma.califications.findMany({
		orderBy:{
			value:'asc'
		}
	});
	return califications;
}
export const updateComment = async (id:number, data: Partial<Createcomments>) => {
	try {
		const validCommentExist = await prisma.comments.findUnique({
			where: { id: Number(id) }
		});
		if (!validCommentExist) {
			throw new Error("Comentario no válido");
		}
		const updatedComment = await prisma.comments.update({
			where: { id: Number(id) },
			data: {
				...data
			}
		});
		return updatedComment;
	} catch (error:any) {
		console.error("Error al actualizar el comentario:", error.message);
		throw new Error(
			error.message || "No se pudo actualizar el comentario"
		);
	}
}