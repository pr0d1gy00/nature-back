import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isBlackListed } from "../services/redisServices";

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ message: "Token no proporcionado" });
	}

	try {
		// Verifica si el token está en la blacklist
		// const blacklisted = await isBlackListed(token);
		// console.log(blacklisted)
		// if (blacklisted) {
		// 	return res
		// 		.status(403)
		// 		.json({
		// 			message:
		// 				"Token no válido. Por favor, cierre e inicie sesión",
		// 		});
		// }

		// Verifica el token con jwt
		jwt.verify(
			token,
			process.env.JWT_SECRET as string,
			(err, user) => {
				if (err) {
					console.error("Error en jwt.verify:", err);

					return res
						.status(403)
						.json({
							message:
								"Token no válido. Por favor, cierre e inicie sesión",
						});
				}

				// Adjunta el usuario al request y continúa
				(req as any).user = user;
				next();
			}
		);
	} catch (error) {
		console.error("Error en authenticateToken:", error);
		return res
			.status(500)
			.json({ message: "Error interno del servidor" });
	}
};
