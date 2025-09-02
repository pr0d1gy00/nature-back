import { Router } from "express";
import { getCategoriesForFilters, getProductsByFilters, getProductStore, getProductsToShowStore, getProductsByNameController} from "../controllers/store.controller";

const router = Router();

router.get("/getProductsToShowStore", getProductsToShowStore);
router.post("/getProductsByFilters", getProductsByFilters);
router.get("/getProductsByName/:nameProductSearch", getProductsByNameController);
router.get("/getCategoriesForFilters", getCategoriesForFilters);
router.post("/getProductToShow", getProductStore);
export default router;