import { Router } from "express";
import { createOrder, getOrders, getOrdersByStatusController, getOrderByIdController, uploadMediaOrderShipmentController, uploadMediaOrderPaymentController, changeStatusOrderController } from '../controllers/order.controller';
import { uploadArray } from "../services/uploadFileService";

const router = Router();

router.post("/createOrders", createOrder);
router.post("/uploadMediaShipment", uploadArray("media", 5), uploadMediaOrderShipmentController);
router.post("/uploadMediaPayment", uploadArray("media", 5), uploadMediaOrderPaymentController);
router.put("/updateOrderStatus", changeStatusOrderController);
router.get("/getAllOrders", getOrders);
router.get("/getOrderById", getOrderByIdController);
router.get("/getOrdersByStatus", getOrdersByStatusController);

export default router;