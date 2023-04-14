import User from "../models/User.js";
import BadRequestError from "../errors/bad-request-error.js";
import attachCookies from "../utils/attach-cookies.js";

const updateUser = async (req, res, next) => {
  try {
    const { email, name, location } = req.body;

    if (!email || !name || !location) {
      throw new BadRequestError("Please provide all values!");
    }

    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.location = location;

    await user.save();

    const token = user.createJWT();

    attachCookies({ res, token });

    res.status(200).json({ user, location: user.location });
  } catch (error) {
    next(error);
  }
};

const getLoggedInUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });

    res.status(200).json({ user, location: user.location });
  } catch (error) {
    next(error);
  }
};

export { updateUser, getLoggedInUser };
