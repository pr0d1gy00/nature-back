import { Router } from "express";
import { getUserProfile } from "../controllers/profile.controller";
const router = Router();

router.get("/getInfoProfile", getUserProfile);

export default router;