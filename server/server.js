import dotenv from "dotenv";
dotenv.config();
// express package
import express from "express";
// npm package
import morgan from "morgan";
// database
import connectDB from "./db/connectDB.js";
// middlewares
import notFoundMiddleware from "./middlewares/not-found-mdw.js";
import errorMiddleware from "./middlewares/error-mdw.js";
import authMiddleware from "./middlewares/auth-mdw.js";
// routes
import authRouter from "./routes/auth-route.js";
import jobsRouter from "./routes/jobs-route.js";
import usersRouter from "./routes/users-router.js";

const app = express();
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

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.json({ message: "Welcome!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);
app.use("/api/v1/users", usersRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

startServer();
