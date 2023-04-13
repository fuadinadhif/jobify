import mongoose from "mongoose";
import moment from "moment";

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
    const { search, status, jobType, sort } = req.query;
    const queryObjects = {
      createdBy: req.user.userId,
    };
    let searchQueryObjects;

    if (search) {
      searchQueryObjects = {
        $or: [
          { position: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { jobLocation: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (status !== "all") queryObjects.status = status;
    if (jobType !== "all") queryObjects.jobType = jobType;

    const combinedQuery = { ...queryObjects, ...searchQueryObjects };
    let result = Job.find(combinedQuery);

    if (sort === "oldest") result = result.sort("createdAt");
    if (sort === "latest") result = result.sort("-createdAt");
    if (sort == "a-z") result = result.sort("position");
    if (sort === "z-a") result = result.sort("-position");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const jobs = await result;
    const totalJobs = await Job.countDocuments(combinedQuery);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(200).json({ jobs, totalJobs, numOfPages });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    let stats = await Job.aggregate([
      {
        $match: {
          createdBy: mongoose.Types.ObjectId(req.user.userId),
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
      const { _id: jobStatus, count } = curr;

      acc[jobStatus] = count;

      return acc;
    }, {});

    const defaultStats = {
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      declined: stats.declined || 0,
      interview: stats.interview || 0,
    };

    let monthlyApplications = await Job.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM Y");

        return { date, count };
      })
      .reverse();

    res.status(200).json({ stats: defaultStats, monthlyApplications });
  } catch (error) {
    next(error);
  }
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
