import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserProps{
	id: number;
	role_id: number;
	name: string;
	email: string;
	password: string;
	dni: string;
	phone?: string;
	address?: string;
	created_at: Date;
	updated_at: Date;
}
export type CreateUserProps = Omit<UserProps, 'id' | 'created_at' | 'updated_at' >;
export type CreateUserPropsWithoutRole = Omit<UserProps, 'id' | 'created_at' | 'updated_at' | 'role_id'>;

export const createUser = async(data:CreateUserProps)=>{
	const userExist = await prisma.user.findUnique({
		where: { email: data.email }
	});
	if (userExist) {
		throw new Error("El email ya está en uso");
	}
	try{
		return  await prisma.user.create({
			data

		})

	}catch(error:any){
		console.error("Error al crear el usuario:", error.message);
		throw new Error(
			error.message || "No se pudo crear el usuario"
		);
	}
}

export const getUserById = async(id:UserProps['id'])=>{
	try {
		return await prisma.user.findUnique({
			where: { id }
		});
	} catch (error:any) {
		console.error("Error al obtener el usuario:", error.message);
		throw new Error(
			error.message || "No se pudo obtener el usuario"
		);
	}
}

export const getAllUsers = async()=>{
	try {
		return await prisma.user.findMany();
	} catch (error:any) {
		console.error("Error al obtener todos los usuarios:", error.message);
		throw new Error(
			error.message || "No se pudo obtener los usuarios"
		);
	}

}

export const updateUser = async(id:UserProps['id'], data:Partial<UserProps>)=>{
	try {
		if (data.email) {
			const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

			if (existingUser && existingUser.id !== id) {
				throw new Error("El email ya está en uso por otro usuario");
			}
		}
		return await prisma.user.update({
			where: { id },
			data
		});
	} catch (error:any) {
		console.error("Error al actualizar el usuario:", error.message);
		throw new Error(
			error.message || "No se pudo actualizar el usuario"
		);
	}
}

export const deleteUser = async(id:UserProps['id'])=>{
	try {
		return await prisma.user.delete({
			where:{
				id: id
			}
		})
	} catch (error:any) {
		console.error("Error al eliminar el usuario:", error.message);
		throw new Error(
			error.message || "No se pudo eliminar el usuario"
		);
	}
}
