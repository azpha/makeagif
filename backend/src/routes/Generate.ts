import { Router } from "express";
import GenerationController from "../controllers/Generation";

const router = Router();

router.post("/", GenerationController.GenerateEditedFile);

export default router;
