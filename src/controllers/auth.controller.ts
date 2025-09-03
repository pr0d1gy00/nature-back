import {Request, Response} from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailSenderService";
import {encryptId} from "../services/encryptedId";

const prisma = new PrismaClient();

export const login = async (req:Request,res:Response)=>{
	const {email, password} = req.body;

	const user = await prisma.user.findUnique({where: {email}});
	if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

	const { password: _, reset_code: __, reset_code_expires: ___, created_at: ____ , updated_at: _____ , role_id: ______,email:_______, dni: ________ , ...userWithoutPassword } = user;

	const encryptedUser = {
		...userWithoutPassword,
		id:encryptId(userWithoutPassword.id.toString())
	}
	const payload = {
		email:user.email,
		id:encryptId(user.id.toString()),
		role_id:encryptId(user.role_id.toString())
	}
	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return res.status(401).json({ message: "Credenciales Incorrectas" });

	const token = jwt.sign(payload,process.env.JWT_SECRET as string,{expiresIn:"8h"});
	const cookieOptions = {
        httpOnly: true,
        sameSite: 'none' as const, // 'as const' ayuda a TypeScript
        secure: process.env.NODE_ENV === "production",
        path: '/',
        maxAge: 12 * 60 * 60 * 1000,
		domain: process.env.FRONTEND_URL
    };
    console.log("Intentando establecer cookie. Opciones:", cookieOptions);
	res.cookie("token", token, cookieOptions);

    return res.status(200).json({ message: "inicio de sesión exitoso.", user: encryptedUser, token });
}

export const logout = async (req:Request, res:Response) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	res.clearCookie("token");
	return res.status(200).json({ message: "Sesión cerrada exitosamente" })

}


export const requestPasswordReset = async (req:Request, res:Response) => {
	const { email } = req.body;

	const user = await prisma.user.findUnique({where:{email}})
	if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  	const code = Math.floor(100000 + Math.random() * 900000).toString();

	const html = `
	<div style="background-color:#fdfee7; font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
		<h1 style="color:#7ed957; font-size: 30px;">Codigo de recuperacion <span style="color: #35384b;">Nature</span></h1>

		<h2 style="color: #7ed957; font-size: 24px;">Recuperación de contraseña</h2>
		<p style="color: #888; font-size: 20px;">Hola <b>${user.name || user.email}</b>,</p>
		<p>Tu código de recuperación es:</p>
		<div style="font-size: 2em; font-weight: bold; color: #4CA7ed957F50; margin: 16px 0;">${code}</div>
		<p style="color: #888; font-weight: bold;">Este código expirará en 1 hora.</p>
		<p style="color: #888; font-size: 14px;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
		<hr>
		<p style="font-size: 16px; color: #7ed957;">Nature App</p>
	</div>
	`;

	await prisma.user.update({
		where:{email},
		data:{
			reset_code: code,
			reset_code_expires: new Date(Date.now() + 7200000)
		}
	})
	await sendEmail(email, "Código de recuperación", `Tu código es: ${code}`,html);

	return res.status(200).json({ message: "Código enviado al correo" });

}

export const resetPassword = async (req:Request, res:Response) => {
	const { email, newPassword, repeatPassword, code } = req.body;

	const user = await prisma.user.findUnique({where: {email}});
	if (!user) return res.status(401).json({ message: "Usuario no encontrado" });
	if (!user || !user.reset_code || !user.reset_code_expires) {
    return res.status(400).json({ message: "No posee codigo de restablecimiento. Por favor solicite uno nuevo." });
	}
	if (user.reset_code !== code) {
		return res.status(400).json({ message: "Código incorrecto" });
	}

	if (user.reset_code_expires < new Date()) {
		return res.status(400).json({ message: "El código ha expirado" });
	}

	if (newPassword !== repeatPassword) {
		return res.status(400).json({ message: "Las contraseñas no coinciden" });
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.user.update({
		where: { email },
		data: { password: hashedPassword, reset_code: null, reset_code_expires: null }
	});

	return res.status(200).json({ message: "Contraseña actualizada con éxito" });
}