import express from "express";
import cors from "cors";
import morgan from "morgan";
import error from "http-errors";
import cron from "node-cron";


import config from "../config/config.js";
import routes from "./routes/index.js";



const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/pmbonlinebackend/check", async (req, res) => {
  res.send({
    status: "success",
    message: "PMB ONLINE Backend OK!",
  });
});

app.use("/pmbonlinebackend/", routes);

app.use((req, res, next) => {
  next(error.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(config.port, config.host, () =>
  console.log(`Server started on ${config.host}:${config.port}`)
);
