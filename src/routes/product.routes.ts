import { Router } from "express";
import { addProduct,getProducts,getProduct, modifyProduct,removeProduct,getStockOfProduct, modifyStockProduct } from "../controllers/product.controller";
import {uploadArray} from "../services/uploadFileService";
const router = Router();

router.post("/createProduct", uploadArray("media", 5), addProduct);
router.get("/getProducts", getProducts);
router.get("/getProduct/:id", getProduct);
router.put("/modifyStockProduct", modifyStockProduct);
router.get("/getStockProduct/:id", getStockOfProduct);
router.put("/modifyProduct/:id", uploadArray("media", 5), modifyProduct);
router.delete("/deleteProduct/:id/:id_user", removeProduct);

export default router;