import express, { Express } from "express";
import DashboardPersistence from "./database/dashboardPersistence";
import {validatorHash, validTypes} from "./utils";
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

app.post("/blocks", validateRequest(), async (req, res) => {

  if (validTypes.includes(req.body.type)) {
    let block;
    try {
      block = await BlockPersistence.createBlock(req.body)
    } catch(err: any) {
      console.log("error en crear el bloque: ", err.message)
      res.sendStatus(500)
      return
    }

    try {
      await PagePersistence.addContentPage({_id: req.body.parent.id}, block._id)
    } catch(err: any) {
      console.log("error en el try/catch 2: ", err.message)
      res.sendStatus(500)
      return
    }

    try {
      await DashboardPersistence.incrementValue(req.body.type, 1)
    } catch(err) {
      console.log("error en el try/catch 3")
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
  if (req.body.type == "page") {
    try {
      await PagePersistence.createPage(req.body)
    } catch(err: any) {
      res.sendStatus(500)
      return
    }
    res.sendStatus(200)
  } else {
    res.sendStatus(400);
    return;
  }
})

app.put("/pages", async (req, res) => {
   try {
        await PagePersistence.updatePage(req.body)
    } catch(err: any) {
        res.sendStatus(500)
        return
    }
    res.sendStatus(200)
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

app.delete("/pages" , async (req, res) => {
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


function validateRequest() {
  return (req: any, res: any, next: any) => {
    if (req.body.type == undefined) {
      return res.sendStatus(400)
    }
    try {
      const validatorResponse = validatorHash.get(req.body.type)?.parse(req.body)
    } catch(err) {
      console.log("invalid request body mira vos")
      return res.sendStatus(400)
    }
    next()
  }
}
