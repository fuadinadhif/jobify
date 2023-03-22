import UnauthorizedError from "../errors/unauthorized-error.js";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnauthorizedError("Not authorized to access this route");
};

export default checkPermissions;
