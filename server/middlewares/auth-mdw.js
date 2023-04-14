import UnauthenticatedError from "../errors/unauthenticated-error.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) throw new UnauthenticatedError("Invalid authentication");

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const demoUser = payload.userId === "64367f80e51e7c6a2ee8d89d";

      req.user = { userId: payload.userId, demoUser };

      next();
    } catch (error) {
      throw new UnauthenticatedError("Invalid authentication");
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
