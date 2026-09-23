import express from "express";
import router from "./router.js";

import logger from "./middleware/logger.js";
import authCheck from "./middleware/authCheck.js";

const app = express();
app.use(express.json());
app.use("/api", router);
app.use("/", logger);
app.use('/admin', authCheck);
export default app;
