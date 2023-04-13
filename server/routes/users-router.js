import express from "express";

import { updateUser } from "../controllers/users-controller.js";
import authMiddleware from "../middlewares/auth-mdw.js";
import demoMiddleware from "../middlewares/demo-mdw.js";

const router = express.Router();

router.route("/updateUser").patch(authMiddleware, demoMiddleware, updateUser);

export default router;
