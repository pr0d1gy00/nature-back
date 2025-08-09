import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string,html:string) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		auth: {
			user: "evangelioparalosjovenes@gmail.com",
			pass: "mwmm sgjy lvyy yics "
		}
	});

	const mailOptions = {
		from: '"Nature" <evangelioparalosjovenes@gmail.com>',
		to,
		subject,
		text,
		html
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}
