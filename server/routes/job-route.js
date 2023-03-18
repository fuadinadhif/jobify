import express from "express";
import {
  createJob,
  getAllJobs,
  getJobStats,
  updateJob,
  deleteJob,
} from "../controllers/job-controller.js";

const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/job-stats").get(getJobStats);
router.route("/:id").patch(updateJob).delete(deleteJob);

export default router;
