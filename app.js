import express from "express";
import router from "./router.js";

import logger from "./middleware/logger.js";
import authCheck from "./middleware/authCheck.js";
import rateLimit from "./middleware/rateLimit.js";

const app = express();
app.use(express.json());
app.use("/api", router);
app.use(logger);
app.use('/admin', authCheck);
app.use(rateLimit);
export default app;
