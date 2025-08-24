import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface CategoryProps{
	id:number
	id_user:string
	name:string
	slug?:string
	description:string

}

type CategoryPropsWithoutId = Omit<CategoryProps, 'id'>;

export const createCategory = async (data:CategoryPropsWithoutId) =>{
	try {
		const { id_user,name, description } = data;
		const slug = name.toLowerCase().replace(/ /g, "-");
		const validUserExist = await prisma.user.findUnique({
			where: { id: Number(id_user) }
		})
		const validCategoryNotExist = await prisma.category.findUnique({
			where: { slug }
		})
		if(validCategoryNotExist) {
			throw new Error("La categoría ya existe")
		}

		if(!validUserExist || validUserExist.role_id !== 1) {
			throw new Error("El usuario no existe o no tiene permisos para realizar esta acción")
		}
		const category = await prisma.category.create({
			data: {
				name,
				slug,
				description
			}
		});
		return category;
	} catch (error:any) {
		console.error("Error al crear la categoría:", error.message);
		throw new Error(
			error.message || "No se pudo crear la categoría"
		);
	}
}
export const getCategoryById = async (id:string)=>{
	try {
		const category = await prisma.category.findUnique({
			where: { id:Number(id) }
		})
		return category;
	} catch (error:any) {
		console.error("Error al obtener la categoría:", error.message);
		throw new Error(
			error.message || "No se pudo obtener la categoría"
		);
	}
}

export const getAllCategories = async ()=>{
	try {
		const categories = await prisma.category.findMany();
		return categories;
	} catch (error:any) {
		console.error("Error al obtener todas las categorías:", error.message);
		throw new Error(
			error.message || "No se pudieron obtener las categorías"
		);
	}
}
export const updateCategory = async(data:CategoryProps)=>{
	try {
		const { id,id_user, name, description } = data;
		const slug = name.toLowerCase().replace(/ /g, "-");

		const validCategoryExist = await prisma.category.findUnique({
			where: { id: Number(id) }
		})
		if(!validCategoryExist) {
			throw new Error("La categoría no existe")
		}
		const validUserExist = await prisma.user.findUnique({
			where: { id: Number(id_user) }
		})
		if(!validUserExist || validUserExist.role_id !== 1) {
			throw new Error("El usuario no existe o no tiene permisos para realizar esta acción")
		}

		const updatedCategory = await prisma.category.update({
			where: { id: Number(id) },
			data: {
				name,
				slug,
				description
			}
		});
		return updatedCategory;
	} catch (error:any) {
		console.error("Error al actualizar la categoría:", error.message);
		throw new Error(
			error.message || "No se pudo actualizar la categoría"
		);
	}
}

export const deleteCategory = async (id:string, idUser:number)=>{
	try {
		const validCategoryExist = await prisma.category.findUnique({
			where: { id: Number(id) }
		});
		if(!validCategoryExist) {
			throw new Error("La categoría no existe");
		}
				const validUserExist = await prisma.user.findUnique({
			where: { id: Number(idUser) }
		})
		if(!validUserExist || validUserExist.role_id !== 1) {
			throw new Error("El usuario no existe o no tiene permisos para realizar esta acción")
		}
		await prisma.category.delete({
			where: { id: Number(id) }
		});
		return { message: "Categoría eliminada correctamente" };
	} catch (error:any) {
		console.error("Error al eliminar la categoría:", error.message);
		throw new Error(
			error.message || "No se pudo eliminar la categoría"
		);
	}

}