import { Router } from "express";
import { addRole, roleList } from "../controllers/roleController.js";

const roleRoute = Router();

roleRoute.get("/", roleList);
roleRoute.post("/", addRole);

export default roleRoute;