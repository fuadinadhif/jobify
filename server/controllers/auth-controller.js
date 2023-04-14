import User from "../models/User.js";
import BadRequestError from "../errors/bad-request-error.js";
import UnauthenticatedError from "../errors/unauthenticated-error.js";
import attachCookies from "../utils/attach-cookies.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const emptyFields = Object.entries({ name, email, password })
      .filter(([, value]) => value === undefined)
      .map(([key]) => key);

    if (emptyFields.length !== 0) {
      throw new BadRequestError(
        `Please provide all values. These field are empty: ${emptyFields.join(
          ", "
        )}`
      );
    }

    const userAlreadyExisted = await User.findOne({ email });

    if (userAlreadyExisted) {
      throw new BadRequestError("Email is already in use");
    }

    const user = await User.create({ name, email, password });
    const userWithoutPassword = Object.fromEntries(
      Object.entries(user.toObject()).filter(([key]) => key !== "password")
    );
    const token = user.createJWT();

    attachCookies({ res, token });

    res
      .status(201)
      .json({ user: userWithoutPassword, location: user.location });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide all values");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const token = user.createJWT();
    user.password = undefined;

    attachCookies({ res, token });

    res.status(200).json({ user, location: user.location });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(200).json({ message: "User has been logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout };
