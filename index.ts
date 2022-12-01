import express, { Express } from "express";
import DashboardPersistence from "./database/dashboardPersistence";
import validTypes from "./utils";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import BlockPersistence from "./database/BlockPersistence";
import { TextValidator, CalloutValidator } from "./schemaValidation";

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

  try {
    const validatorResponse = TextValidator.parse(req.body)
  } catch(err) {
    console.log("validation error")
    res.sendStatus(400)
    return
  }

  if (validTypes.includes(req.body.type)) {
    try {
      await BlockPersistence.createBlock(req.body)
    } catch(err) {
      console.log("error en el try/catch 1")
      res.sendStatus(500)
      return
    }

    try {
      await DashboardPersistence.incrementValue(req.body.type, 1)
    } catch(err) {
      console.log("error en el try/catch 2")
      res.sendStatus(500)
      return
    }
  } else {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

// app.get("/blocks", async (req, res) => {
//   try {
//     const result = await BlockPersistence.getBlock(req);
//     res.sendStatus(200);
//     res.send(result);
//     return result;
//   } catch (err) {
//     console.log("error en el try/catch 3")
//     res.sendStatus(500)
//     return
//   }
// });

app.delete("/blocks", async (req, res) => {

  try {
    let block = await BlockPersistence.deleteBlock(req.body)
    try {
      await DashboardPersistence.incrementValue(block.type, -1)
    } catch (err) {
      console.log("error en el try/catch 3")
      res.sendStatus(500)
      return
    }
  } catch(err: any) {
    console.log("error en el try/catch 1", err.message)
    res.sendStatus(500)
    return
  }

  res.sendStatus(200);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log("listening on port 8000...");
});
