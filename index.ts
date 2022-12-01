import express, { Express } from "express";
import DashboardPersistence from "./database/dashboardPersistence";
import validTypes from "./utils";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import BlockPersistence from "./database/BlockPersistence";
import { TextValidator, CalloutValidator } from "./schemaValidation";
import PagePersistence from "./database/PagePersistence";

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
  } catch(err: any) {
    console.log("validation error: ", err.message)
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

app.get("/blocks", async (req, res) => {
  let result
  try {
    result = await BlockPersistence.getBlock(req);
  } catch (err: any) {
    console.log("error en el try/catch 3: ", err.message)
    res.sendStatus(500)
    return
  }
  res.send(result)
});

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

app.post("/pages", async (req, res) => {
  console.log("en el resquest")
  if (req.body.type == "page") {
    try {
      console.log("adentro del try, antes de create")
      await PagePersistence.createPage(req.body)
      console.log("despues del create")
    } catch(err: any) {
      console.log("error en el try/catch 1: ", err.message)
      res.sendStatus(500)
      return
    }
    res.sendStatus(200)
  } else {
    res.sendStatus(400);
    return;
  }
})

app.get("/pages", async (req, res) => {
  let result
  try {
    result = await PagePersistence.getPage(req);
  } catch (err: any) {
    console.log("error en el try/catch: ", err.message)
    res.sendStatus(500)
    return
  }
  res.send(result)
})

app.delete("/pages", async (req, res) => {
  try {
    let page = await PagePersistence.deletePage(req.body)
    console.log(page)
  } catch (err: any) {
    console.log(err.message)
    res.sendStatus(500)
    return
  }

  res.sendStatus(200);
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log("listening on port 8000...");
});
