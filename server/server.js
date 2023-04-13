import dotenv from "dotenv";
dotenv.config();
// node packages
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// express packages
import express from "express";
// npm packages
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
// database
import connectDB from "./db/connectDB.js";
// middlewares
import notFoundMiddleware from "./middlewares/not-found-mdw.js";
import errorMiddleware from "./middlewares/error-mdw.js";
import authMiddleware from "./middlewares/auth-mdw.js";
// routes
import authRouter from "./routes/auth-route.js";
import jobRouter from "./routes/jobs-route.js";
import populateRouter from "./routes/populate-route.js";
import userRouter from "./routes/users-router.js";

const app = express();

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(
  express.static(
    path.resolve(dirname(fileURLToPath(import.meta.url)), "../client/build")
  )
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobRouter);
app.use("/api/v1/populate", populateRouter);
app.use("/api/v1/users", userRouter);
app.get("*", function (req, res) {
  res.sendFile(
    path.resolve(
      dirname(fileURLToPath(import.meta.url)),
      "../client/build",
      "index.html"
    )
  );
});
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Server listening to port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

startServer();
