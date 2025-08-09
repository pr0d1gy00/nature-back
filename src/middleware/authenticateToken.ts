import {Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { isBlackListed } from '../services/redisServices';

export const authenticateToken = async (req:Request, res:Response, next:NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });
	if (await isBlackListed(token)){
		return res.status(403).json({ message: "Token no valido. Por favor, cierre e inicie sesión" });
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (err, user)=>{
		if(err) return res.status(403).json({ message: "Token no valido. Por favor, cierre e inicie sesión" });
		(req as any).user = user;
		next();
	});
}