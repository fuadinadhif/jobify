const createJob = async (req, res) => {
  res.send("Create Job");
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
