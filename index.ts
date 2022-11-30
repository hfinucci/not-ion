import express, { Express, Request, Response } from "express";
import DashboardPersistence from "./database/dashboardPersistence";
import validTypes from "./utils";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

const app: Express = express();
const port = 8000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/dashboard", async (req, res) => {
  await DashboardPersistence.createDashboard();
  res.sendStatus(200);
});

app.get("/dashboard", async (req, res) => {
  const result = await DashboardPersistence.getDashboard();
  res.send(result);
});

app.post("/blocks", async (req, res) => {
  // TODO manejo de logica con mongo
  if (validTypes.includes(req.body.type)) {
    await DashboardPersistence.incrementValue(req.body.type, 1);
  } else {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.delete("/blocks", async (req, res) => {
  if (validTypes.includes(req.body.type)) {
    await DashboardPersistence.incrementValue(req.body.type, -1);
  } else {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log("listening on port 8000...");
});
