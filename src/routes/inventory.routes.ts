import { Router } from "express";
import { getAllInventory,getAllMovementsInventory } from "../controllers/inventory.controller";
const router = Router();

router.get("/getInventory", getAllInventory);
router.get("/getMovements", getAllMovementsInventory);

export default router;