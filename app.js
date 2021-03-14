import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { HttpCode } from "./helpers/constants.js";
import contactsRouter from "./routes/api/contacts/index.js";
import usersRouter from "./routes/api/users/index.js";
const { json } = express;
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.static(process.env.PUBLIC_DIR));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(json({ limit: 10000 }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Too many requests, please try again later.",
    });
  },
});

app.use("/api/", apiLimiter);
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

export default app;
