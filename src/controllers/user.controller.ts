import { NextFunction, Request, Response } from "express";
import {createUser, getUserById, getAllUsers, updateUser, deleteUser} from '../services/userService'
import { UserProps } from "../services/userService";
import bcrypt from 'bcrypt';

export const addUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userData: UserProps = req.body;
	const password = await bcrypt.hash(userData.password, 10);

	try {
		const newUser = await createUser({...userData, password});
		res.status(201).json({message:'Usuario creado exitosamente', user: newUser});
	} catch (error) {
		next(error);
	}
}

export const getUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userId = parseInt(req.params.id);
	try {
		const user = await getUserById(userId);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.status(200).json({message:'Usuario obtenido exitosamente', user: user});
	} catch (error) {
		next(error);
	}
}

export const getUsers = async (req:Request, res:Response, next:NextFunction)=>{
	try {
		const users = await getAllUsers();
		res.status(200).json({message:'Usuarios obtenidos exitosamente', users: users});
	} catch (error) {
		next(error);
	}
}

export const modifyUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userId = parseInt(req.params.id);
	const userData: Partial<UserProps> = req.body;
	const password = await bcrypt.hash(req.body.password, 10);

	try {
		const updatedUser = await updateUser(userId, {...userData, password});
		if (!updatedUser) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.status(200).json({message:'Usuario modificado exitosamente', user: updatedUser});
	} catch (error) {
		next(error);
	}
}

export const removeUser = async (req:Request, res:Response, next:NextFunction)=>{
	const userId = parseInt(req.params.id);
	try {
		const deletedUser = await deleteUser(userId);
		if (!deletedUser) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.status(204).send();
	} catch (error) {
		next(error);
	}
}