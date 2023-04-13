import express from "express";

import {
  createJob,
  getAllJobs,
  getJobStats,
  updateJob,
  deleteJob,
} from "../controllers/jobs-controller.js";
import demoMiddleware from "../middlewares/demo-mdw.js";

const router = express.Router();

router.route("/").post(demoMiddleware, createJob).get(getAllJobs);
router.route("/job-stats").get(getJobStats);
router
  .route("/:id")
  .patch(demoMiddleware, updateJob)
  .delete(demoMiddleware, deleteJob);

export default router;
