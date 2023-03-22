import dotenv from "dotenv";
dotenv.config();

import { readFile } from "node:fs/promises";

import Job from "../models/Job.js";

const populate = async (req, res, next) => {
  try {
    // Remove older data
    await Job.deleteMany();

    // Populate jobs. EACH JOB HAS SPECIFIC USER CREATEDBY (See the mock data)
    const data = JSON.parse(
      await readFile(
        new URL("../mock-data/job-mock-data.json", import.meta.url),
        { encoding: "utf8" }
      )
    );

    await Job.create(data);
    // End of populate jobs

    res
      .status(201)
      .json({ message: "Database has been populated with a mock data" });
  } catch (error) {
    next(error);
  }
};

export default populate;
