import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import nodemailer from "nodemailer";

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";
const BDUrl = process.env.BD_URL || "";
const jwtSecret = process.env.JWT_SECRET || null;

const mainDbConn = {
  url: `${process.env.DB_URL}`,
};

export default {
  port,
  host,
  mainDbConn,
  BDUrl,
  jwtSecret
};

