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
  res.sendStatus(201);
});

app.get("/dashboard", async (req, res) => {
  const result = await DashboardPersistence.getDashboard();
  res.status(200).send(result);
});

app.post("/blocks", validateRequest(), async (req, res) => {

  let block;
  if (validTypes.includes(req.body.type)) {
    try {
      block = await BlockPersistence.createBlock(req.body)
    } catch(err: any) {
      console.log("error en crear el bloque: ", err.message)
      res.sendStatus(500)
      return
    }

    try {
      let result
      if(block.parent.type === "page") {
        result = await PagePersistence.addContentPage({_id: req.body.parent.id}, block._id)
      } else {
        result = await BlockPersistence.addContentBlock({_id: req.body.parent.id}, block._id)
      }
      console.log(result)
      if (result == null) {
        await BlockPersistence.deleteBlock({_id: block._id})
        res.status(404).send("Parent not found")
        return
      }
    } catch (err: any) {
      console.log("error en el try/catch 2: ", err.message)
      await BlockPersistence.deleteBlock({_id: block._id})
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
  res.status(201).send({_id: block._id});
});

app.get("/blocks/:blockId", async (req, res) => {
  let result
  try {
    result = await BlockPersistence.getBlock({_id: req.params.blockId});
  } catch (err: any) {
    console.log("error en el try/catch 3: ", err.message)
    res.sendStatus(500)
    return
  }
  if(result == null) {
    res.sendStatus(204)
  } else {
    res.status(200).send(result)
  }
});

app.put("/blocks/:blockId", async (req, res) => {
  let result
  try {
    result = await BlockPersistence.updateBlock({_id: req.params.blockId}, req.body);
  } catch (err: any) {
    console.log("error updating block: ", err.message)
    res.sendStatus(500)
    return
  }
  res.status(200).send(result)
});

app.delete("/blocks/:blockId", async (req, res) => {

  try {
    let block = await BlockPersistence.deleteBlock({_id: req.params.blockId})
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

  res.sendStatus(204);
});

app.post("/pages", async (req, res) => {
  if (req.body.type == "page") {
    let page;
    try {
      page = await PagePersistence.createPage(req.body)
    } catch(err: any) {
      res.sendStatus(500)
      return
    }
    res.status(201).send({_id: page._id});
  } else {
    res.sendStatus(400);
    return;
  }
})

app.get("/pages", async (req, res) => {
  let result;
  try {
    result = await PagePersistence.getPages()
  } catch(err: any) {
    console.log(err.message)
    res.sendStatus(500)
    return
  }
  if (result == null) {
    res.sendStatus(204)
  } else {
    res.status(200).send(result)
  }
})

app.put("/pages/:pageId", async (req, res) => {
  let result
   try {
        result = await PagePersistence.updatePage({_id: req.params.pageId}, req.body)
    } catch(err: any) {
        console.log(err.message)
        res.sendStatus(500)
        return
    }
    res.status(200).send(result)
})

app.get("/pages/:pageId", async (req, res) => {
  let result
  try {
    result = await PagePersistence.getPage({_id: req.params.pageId});
  } catch (err: any) {
    console.log("error en el try/catch: ", err.message)
    res.sendStatus(500)
    return
  }
  if (result == null) {
    res.sendStatus(204)
  } else {
    res.status(200).send(result)
  }
})

app.delete("/pages/:pageId" , async (req, res) => {
  try {
    let page = await PagePersistence.deletePage({_id: req.params.pageId})
    console.log(page)
  } catch (err: any) {
    console.log(err.message)
    res.sendStatus(500)
    return
  }

  res.sendStatus(204);
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
