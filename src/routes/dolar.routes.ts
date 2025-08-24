import { Router } from "express"
import { getDollar } from "../controllers/sendDollar.controller";

const router = Router();

router.get("/dolar", getDollar);
