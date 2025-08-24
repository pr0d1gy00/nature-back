import { Router } from "express";
import { getCategoriesForFilters, getProductsByFilters, getProductsToShowStore } from "../controllers/store.controller";

const router = Router();

router.get("/getProductsToShowStore", getProductsToShowStore);
router.post("/getProductsByFilters", getProductsByFilters);
router.get("/getCategoriesForFilters", getCategoriesForFilters);
export default router;