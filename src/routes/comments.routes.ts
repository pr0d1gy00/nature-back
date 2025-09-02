import { Router } from "express";
import {createCommentController,getAllCommentsController,getCommentsByProductIdController,deleteCommentController,updateCommentController, getAllCalificationsController} from "../controllers/comments.controller";

const router = Router();

router.post("/createComment", createCommentController);
router.get("/getAllComments", getAllCommentsController);
router.get("/getCommentsByProductId/:product_id", getCommentsByProductIdController);
router.delete("/deleteComment/:id", deleteCommentController);
router.put("/updateComment", updateCommentController);
router.get("/getAllCalifications", getAllCalificationsController);
export default router;
