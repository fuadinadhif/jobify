import express from "express";
import rateLimiter from "express-rate-limit";

import { register, login } from "../controllers/auth-controller.js";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const router = express.Router();

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);

export default router;
