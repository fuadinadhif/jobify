import Job from "../models/Job.js";
import BadRequestError from "../errors/bad-request-error.js";

const createJob = async (req, res, next) => {
  try {
    const { position, company } = req.body;

    if (!position || !company) {
      throw new BadRequestError("Please provide all values");
    }

    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);

    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res) => {
  res.send("Get All Jobs");
};

const getJobStats = async (req, res) => {
  res.send("Show Job Stats");
};

const updateJob = async (req, res) => {
  res.send("Update Job");
};

const deleteJob = async (req, res) => {
  res.send("Delete Job");
};

export { createJob, getAllJobs, getJobStats, updateJob, deleteJob };
