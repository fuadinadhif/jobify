import UnauthenticatedError from "../errors/unauthenticated-error.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthenticatedError("Invalid authentication");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      throw new UnauthenticatedError("Invalid authentication");
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
