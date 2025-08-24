import {Router} from "express"
import { addCategory, getCategory, getCategories, modifyCategory, removeCategory } from "../controllers/category.controller";

const router = Router();

router.post("/createCategory", addCategory);
router.get("/getCategory/:id", getCategory);
router.get("/getCategories", getCategories);
router.put("/updateCategory/:id", modifyCategory);
router.delete("/deleteCategory/:id/:id_user", removeCategory);

export default router;
