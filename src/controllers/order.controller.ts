import { Request, Response } from "express";
import { createOrderByUser, getAllOrders, getOrderById, getOrdersByStatus, uploadMediaOrderShipment, uploadMediaOrderPayment, changesOrderStatus } from '../services/orderService';
import { decryptId } from '../services/encryptedId';
import { sendEmail } from "../services/emailSenderService";
import { getUserById } from "../services/userService";

export const createOrder = async (req: Request, res: Response) => {
	const { user_id, address, data } = req.body;
	const decryptedId = decryptId(user_id);

	console.log(data)
	const decryptedIdProduct = data.map((item: { product_id: string; quantity: number }) => ({
		product_id: parseInt(decryptId(item.product_id)),
		quantity: item.quantity
	}));
	try {
		const response = await createOrderByUser({ user_id: decryptedId, address, data: decryptedIdProduct });
		res.status(201).json({ message: "Order created successfully" });
		const html = `
        <!DOCTYPE html>
        <html lang="es">
       <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f7;
                    font-size: 18px; /* Aumentado el tamaño base */
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .header {
                    background-color: #7ed957;
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 38px; /* Aumentado */
                    font-weight: 600;
                }
                .content {
                    padding: 30px;
                    color: #333333;
                    line-height: 1.7; /* Aumentado para más espacio */
                }
                .content p {
                    margin: 0 0 18px; /* Aumentado */
                }
                .order-details {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 25px 0;
                }
                .order-details th, .order-details td {
                    padding: 14px; /* Aumentado */
                    text-align: left;
                    border-bottom: 1px solid #eeeeee;
                    font-size: 16px; /* Añadido tamaño explícito */
                }
                .order-details th {
                    background-color: #f9f9f9;
                    font-weight: 600;
                    color: #555;
                }
                .total-section {
                    text-align: right;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #e0e0e0;
                }
                .total-section p {
                    margin: 5px 0;
                    font-size: 28px; /* Aumentado */
                    font-weight: bold;
                }
                .footer {
                    background-color: #f4f4f7;
                    color: #888888;
                    padding: 25px;
                    text-align: center;
                    font-size: 16px; /* Aumentado */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Gracias por tu compra!</h1>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    <p>Tu orden ha sido creada y procesada con éxito. A continuación, encontrarás los detalles de tu compra:</p>

                    <table class="order-details">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${response.dataToResponseController.map(item =>
								`
                                <tr>
                                    <td>${item.name}</td>
									<td>${item.quantity}</td>
									<td>$${item.price}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <p>Total: <strong style="color: #7ed957;">$${response.order.total}</strong></p>
                    </div>

                    <p><strong>Dirección de envío:</strong><br>${response.order.address}</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Nature. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>`;

		const emailUser = await getUserById(parseInt(decryptedId));
		await sendEmail(
			emailUser?.email || "",
			"Felicidades por tu compra",
			`Su compra ha sido realizada con éxito.`,
			html
		);
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
};
export const getOrderByIdController = async (req: Request, res: Response) => {
    const  id  = req.query.id;
    console.log(id)
    try {
        const orders = await getOrderById(Number(id));
        console.log(
            orders
        )
        res.status(200).json({ message: 'Orden obtenida', orders });
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};
export const getOrdersByStatusController = async (req: Request, res: Response) => {
    const  status  = req.query.status;
    try {
        const orders = await getOrdersByStatus({ status: status as 'pendiente' | 'pagado' | 'enviado' | 'cancelado' });
        res.status(200).json({ message: 'Compras obtenidas', orders });
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
}

export const getOrders = async (req: Request, res: Response) => {
	try {

		const orders = await getAllOrders();
		res.status(200).json({message:'Compras obtenidas',orders});
	} catch (error:any) {
		res.status(400).json({ message: error.message });
	}
}
export const uploadMediaOrderShipmentController = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.query;
		const files = req.files as Express.Multer.File[];
		const mediaData = files.map((file, index) => ({
			url: `/uploads/${file.filename}`,
			
		}));
		await uploadMediaOrderShipment(Number(orderId), mediaData);
		return res.json({ message: "Medios de envío subidos correctamente" });
	} catch (error: any) {
		console.error("Error al subir medios de envío:", error);
		res.status(400).json({ message: error.message });
	}
};
export const changeStatusOrderController = async (req: Request, res: Response) => {
    const { orderId, status, userId } = req.body;
    const decryptedId = decryptId(userId);
    try {
        const updatedOrder = await changesOrderStatus(Number(orderId), Number(decryptedId), status);
        res.status(200).json({ message: "Estado de la orden actualizado", updatedOrder });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
export const uploadMediaOrderPaymentController = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.query;
		const files = req.files as Express.Multer.File[];
		const mediaData = files.map((file, index) => ({
			url: `/uploads/${file.filename}`,

		}));
		await uploadMediaOrderPayment(Number(orderId), mediaData);
		return res.json({ message: "Medios de pago subidos correctamente" });
	} catch (error: any) {
		console.error("Error al subir medios de pago:", error);
		res.status(400).json({ message: error.message });
	}
};