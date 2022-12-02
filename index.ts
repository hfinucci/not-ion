import express, {Express} from "express";
import DashboardPersistence from "./database/dashboardPersistence";
import {blockValidatorHash, validTypes} from "./utils";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import BlockPersistence from "./database/BlockPersistence";
import {TextValidator, CalloutValidator, UserValidator, PageValidator} from "./schemaValidation";
import PagePersistence from "./database/PagePersistence";
import UserPersistence from "./database/UserPersistence";

const bcrypt = require('bcrypt');

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


app.post("/users", validateUserRequest(), async (req, res) => {
    let user;
    try {
        user = await UserPersistence.createUser(req.body);
    } catch (err: any) {
        console.log("error creating user: ", err.message);
        res.sendStatus(500);
        return
    }
    res.status(201).send({_id: user._id});
})


app.post("/blocks", validateBlockRequest(), authorize(), async (req, res) => {

    let block;
    if (validTypes.includes(req.body.type)) {
        try {
            block = await BlockPersistence.createBlock(req.body)
        } catch (err: any) {
            console.log("error creating block: ", err.message)
            res.sendStatus(500)
            return
        }

        try {
            let result
            if (block.parent.type === "page") {
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
        } catch (err) {
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
    if (result == null) {
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
    } catch (err: any) {
      console.log("error updating dashboard: ", err.message)
      res.sendStatus(500)
      return
    }
    try {
      console.log("BLOCK: ", block)
      if (block.parent.type === "page") {
        await PagePersistence.removeContentPage({_id: block.parent.id}, block._id)
      } else {
        await BlockPersistence.removeContentBlock({_id: block.parent.id}, block._id)
      }
    } catch(err: any){
      console.log("error en el try/catch 3", err.message)
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

app.post("/pages", validatePageRequest(), async (req, res) => {
    if (req.body.type == "page") {
        let page;
        try {
            page = await PagePersistence.createPage(req.body)
        } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
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

app.delete("/pages/:pageId", async (req, res) => {
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

app.get("/pages/user/:userId", async (req, res) => {
    let result
    try {
        result = await PagePersistence.getPagesByUser(req.params.userId)
    } catch (err: any) {
        console.log(err.message)
        res.sendStatus(500)
        return
    }
    if (result == null || result.length == 0) {
        res.sendStatus(204)
    } else {
        res.status(200).send(result)
    }
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log("listening on port 8000...");
});

function validateUserRequest() {
    return (req: any, res: any, next: any) => {
        try {
            UserValidator.parse(req.body);
        } catch (err: any) {
            console.log("invalid request body: ", err.message)
            return res.sendStatus(400)
        }
        next()
    }
}

function validatePageRequest() {
  return (req: any, res: any, next: any) => {
    try {
      PageValidator.parse(req.body);
    } catch (err: any) {
      console.log("invalid request body: ", err.message)
      return res.sendStatus(400)
    }
    next()
  }
}

function validateBlockRequest() {
    return (req: any, res: any, next: any) => {
        if (req.body.type == undefined) {
            return res.sendStatus(400)
        }
        try {
            blockValidatorHash.get(req.body.type)?.parse(req.body)
        } catch (err: any) {
            console.log("invalid request body: ", err.message)
            return res.sendStatus(400)
        }
        next()
    }
}

function authorize() {
    return async (req: any, res: any, next: any) => {
        const header = req.headers.authorization;
        console.log(header)
        if (!header?.startsWith("Basic ")) {
            console.log("authentication failed: incorrect authentication header");
            return res.sendStatus(401)
        }
        const base64Credentials = header.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
        const [email, password] = credentials.split(":");
        if (await checkCredentials(email, password)) {
            console.log("FUNCIONA?")
            next();
        } else {
            console.log("authentication failed: incorrect username or password")
            return res.sendStatus(401)
        }
    }
}

async function checkCredentials(email: string, password: string): Promise<boolean> {
    const userObject = await UserPersistence.getPasswordByEmail(email)
    try {
        return await bcrypt.compare(password, userObject.password)
    } catch (err: any) {
        return false
    }
}
