import { Router } from "express";
import { addUser, getUser, getUsers, modifyUser, removeUser } from "../controllers/user.controller";
const router = Router();

router.post("/createUser", addUser);
router.get("/getUser/:id", getUser);
router.get("/getUsers", getUsers);
router.put("/modifyUser/:id", modifyUser);
router.delete("/removeUser/:id", removeUser);

export default router;
