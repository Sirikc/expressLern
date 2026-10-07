import express from "express";
import cookieParser from "cookie-parser";
import router from "./router.js";
import authRouter from "./authRouter.js";

import logger from "./middleware/logger.js";
import authCheck from "./middleware/authCheck.js";
import rateLimit from "./middleware/rateLimit.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api", router);
app.use(logger);
app.use('/admin', authCheck);
app.use(rateLimit);
export default app;
