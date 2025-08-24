import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const roles = [
		{ name: "Admin", description: "Administrador del sistema" },
		{ name: "User", description: "Usuario estándar" },
		{
			name: "Moderator",
			description: "Moderador con permisos limitados",
		},
	];

	for (const role of roles) {
		const existingRole = await prisma.role.findUnique({
			where: { name: role.name },
		});

		if (!existingRole) {
			await prisma.role.create({
				data: role,
			});
			console.log(`Rol creado: ${role.name}`);
		} else {
			console.log(`Rol ya existe: ${role.name}`);
		}
	}
	const users = [
		{
			email: "calitoalejandro184@gmail.com",
			password: await bcrypt.hash("prodigy", 10),
			name: "Admin User",
			role: { connect: { name: "Admin" } },
			dni: "1234567890",
		},
		{
			email: "user@example.com",
			password: await bcrypt.hash("prodigy", 10),
			name: "Regular User",
			role: { connect: { name: "User" } },
			dni: "0987654321",
		},
	];

	for (const user of users) {
		const existingUser = await prisma.user.findUnique({
			where: { email: user.email },
		});

		if (!existingUser) {
			await prisma.user.create({
				data: user,
			});
			console.log(`Usuario creado: ${user.email}`);
		} else {
			console.log(`Usuario ya existe: ${user.email}`);
		}
	}
}

main()
	.then(() => {
		console.log("Seed completado");
		prisma.$disconnect();
	})
	.catch((error) => {
		console.error("Error en el seed:", error);
		prisma.$disconnect();
		process.exit(1);
	});
