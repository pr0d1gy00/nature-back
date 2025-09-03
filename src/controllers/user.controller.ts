import { NextFunction, Request, Response } from "express";
import {createUser, getUserById, getAllUsers, updateUser, deleteUser, CreateUserPropsWithoutRole, CreateUserProps} from '../services/userService'
import { UserProps } from "../services/userService";
import bcrypt from 'bcrypt';
import {decryptId, encryptId} from "../services/encryptedId";

export const addUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userData: CreateUserPropsWithoutRole = req.body;
	if (!userData.email || !userData.password || !userData.name || !userData.phone || !userData.address || !userData.dni) {
		return res.status(400).json({ message: "Faltan datos obligatorios" });
	}
	if(userData.password.length < 6){
		return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
	}
	if(!userData.email.includes('@')){
		return res.status(400).json({ message: "El email no es válido" });
	}

	const password = await bcrypt.hash(userData.password, 10);
	const newUserToRegister:CreateUserProps ={
		...userData,
		password,
		role_id:2
	}
	try {
		const newUser = await createUser(newUserToRegister);
		res.status(201).json({message:'Usuario creado exitosamente', user: newUser});
	} catch (error:any) {
		res.status(error.code || 500).json({ message: error.message });
	}
}

export const getUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userId = parseInt(req.params.id);
	try {
		const user = await getUserById(userId);

		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		const encryptedUser = {
			...user,
			id: encryptId(user.id.toString())
		};
		res.status(200).json({message:'Usuario obtenido exitosamente', user: encryptedUser});
	} catch (error:any) {
		res.status(error.code || 500).json({ message: error.message });
	}
}

export const getUsers = async (req:Request, res:Response, next:NextFunction)=>{
	try {
		const users = await getAllUsers();
		if(!users){
			return res.status(404).json({ message: "No se encontraron usuarios" });
		}
		const encryptedUsers = users.map(user => ({
			...user,
			id: encryptId(user.id.toString())
		}))
		res.status(200).json({message:'Usuarios obtenidos exitosamente', users: encryptedUsers});
	} catch (error:any) {
		res.status(error.code || 500).json({ message: error.message });
	}
}

export const modifyUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userId = parseInt(req.params.id);
	const decryptedId = decryptId(userId.toString());
	const userData: Partial<UserProps> = req.body;
	const userDataWithIdDecrypted = { id: parseInt(decryptedId), ...userData };
	const password = await bcrypt.hash(req.body.password, 10);

	try {
		const updatedUser = await updateUser(parseInt(decryptedId), {...userDataWithIdDecrypted, password});
		if (!updatedUser) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.status(200).json({message:'Usuario modificado exitosamente', user: updatedUser});
	} catch (error:any) {
		res.status(error.code || 500).json({ message: error.message });
	}
}

export const removeUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userId = parseInt(req.params.id);
	const decryptedId = decryptId(userId.toString());
	try {
		const deletedUser = await deleteUser(parseInt(decryptedId));
		if (!deletedUser) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.status(204).send();
	} catch (error:any) {
		res.status(error.code || 500).json({ message: error.message });
	}
}