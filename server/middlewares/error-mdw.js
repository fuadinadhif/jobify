/* eslint-disable-next-line no-unused-vars */
const errorMiddleware = (error, req, res, next) => {
  const defaultError = {
    statusCode: error.statusCode || 500,
    message: error.message || "General error",
  };

  if (error.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (error.code && error.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.message = `${Object.keys(
      error.keyValue
    )} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({ message: defaultError.message });
};

export default errorMiddleware;
