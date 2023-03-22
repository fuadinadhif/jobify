import express from "express";

import populate from "../controllers/populate-controller.js";

const router = express.Router();

router.route("/").post(populate);

export default router;
