import loadEnvVariables from "./shared/utils/envHelper.js";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { kafkaClusters, consumeKafkaEvent } from "../src/shared/eda/kafka.js";

import logger from "morgan";

// import scheduler from './shared/cron/orderStatus.js'
// import initializeFirebase from './lib/firebase/initializeFirebase.js';
import logErrors from "./shared/utils/logErrors.js";
import router from "./shared/utils/router.js";
import dbConnect from "./shared/database/mongooseConnector.js";
// import redisConnect from './database/redisConnector.js';
import path from "path";
import { InitConsumer } from "./shared/eda/consumerInit/initConsumer.js";
import { razorPayConnect } from "../src/shared/intigrations/razor_pay/razorPayConnector.js";
import { redisConnect } from "./shared/database/redis.js";
import { NewKafka } from "./shared/eda/kafka.js";
import { seedDB } from "./shared/db/dbService.js";
import fs from "fs";
import WebLogger from "./shared/utils/web_logger.js";
import basicAuth from "./shared/middlewares/basicAuth.js";
import { awsConnect } from "./shared/utils/upload_to_s3.js";

/*
 Copyright (C) 2022 Eunimart Omnichannel Pvt Ltd. (www.eunimart.com)
 All rights reserved.
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License v3.0 as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License v3.0 for more details.
 You should have received a copy of the GNU Lesser General Public License v3.0
 along with this program.  If not, see <https://www.gnu.org/licenses/lgpl-3.0.html/>.
*/

const app = express();
app.use(cors());
app.options("*", cors());

loadEnvVariables();
// initializeFirebase();

// app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(logger("combined"));

app.use("/api/v1/ondc", cors(), router);
app.use(logErrors);
// app.use(logger('dev'));
app.use("/", express.static(path.resolve() + "/public")); // ← adjust

app.get("/logs", basicAuth, function (req, res) {
  var index = fs.readFileSync("./web_logger.html");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

// scheduler();
app.get("*", (req, res) => {
  res.send("API NOT FOUND");
});

const dbPort = process.env.PORT || 8080;

try {
  await redisConnect();
  console.info("Redis connection successful");
  await dbConnect();
  console.info("Database connection successful");
  var server = app.listen(dbPort, () => {
    console.info(`Listening on port ${dbPort}`);
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}

WebLogger(server);
NewKafka();
awsConnect()
InitConsumer();
seedDB();
razorPayConnect();
