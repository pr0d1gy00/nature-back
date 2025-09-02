import { Request, Response } from "express";
import { getAllInfoUserById } from "../services/profileService";
import { decryptId } from "../services/encryptedId";

export const getUserProfile = async (req: Request, res: Response) => {
	const { userId } = req.query;
	const decryptedId = decryptId(userId as string);
	//excluir password

	try {
		const userInfo = await getAllInfoUserById(
			parseInt(decryptedId));
		const { password, ...userWithoutPassword } = userInfo || {};
		return res.json(userWithoutPassword);
	} catch (error: any) {
		console.error("Error al obtener el perfil del usuario:", error.message);
		return res.status(500).json({
			message: error.message || "No se pudo obtener el perfil del usuario",
		});
	}
};
