import BadRequestError from "../errors/bad-request-error.js";

const demoMiddleware = (req, res, next) => {
  try {
    if (req.user.demoUser) {
      throw new BadRequestError(
        "Demo User. Read Only! Create a new account for full access"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default demoMiddleware;
