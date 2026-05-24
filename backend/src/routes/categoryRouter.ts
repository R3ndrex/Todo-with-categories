import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
const categoryRouter: Router = Router();

categoryRouter.get("/", categoryController.getAll);
export default categoryRouter;
