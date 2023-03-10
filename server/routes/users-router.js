import express from "express";
import { updateUser } from "../controllers/users-controller.js";
import authMiddleware from "../middlewares/auth-mdw.js";

const router = express.Router();

router.route("/updateUser").patch(authMiddleware, updateUser);

export default router;
