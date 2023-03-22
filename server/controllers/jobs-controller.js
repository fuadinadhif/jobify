import Job from "../models/Job.js";
import BadRequestError from "../errors/bad-request-error.js";
import NotFoundError from "../errors/not-found-error.js";
import checkPermissions from "../utils/check-permissions.js";

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

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId });

    res.status(200).json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res) => {
  res.send("Show Job Stats");
};

const updateJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    const { company, position } = req.body;

    if (!company || !position) {
      throw new BadRequestError("Please provide all values");
    }

    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      throw new NotFoundError(`No job with id: ${jobId}`);
    }

    checkPermissions(req.user, job.createdBy);

    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ updatedJob });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      throw new NotFoundError(`No job with id: ${jobId}`);
    }

    checkPermissions(req.user, job.createdBy);

    await job.remove();

    res.status(200).json({ message: "Job has been removed" });
  } catch (error) {
    next(error);
  }
};

export { createJob, getAllJobs, getJobStats, updateJob, deleteJob };
