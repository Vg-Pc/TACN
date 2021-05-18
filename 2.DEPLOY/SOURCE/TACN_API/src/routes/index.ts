import { Express, Request, Response } from "express";
import * as subdomain from "express-subdomain";
import * as apiRoutes from "@routes/api.routes";
import * as adminRoutes from "@routes/admin.routes";
import * as express from "express";
export function initRoutes(app: Express) {
  app.use(apiRoutes.initRoutes(app, express.Router()));
  // app.use(subdomain("api", apiRoutes.initRoutes(app, express.Router())));
  app.use(subdomain("admin", adminRoutes.initRoutes(app, express.Router())));
  app.get("/", (req, res) =>
    res.status(200).send({ message: "Welcome to IMFO world" })
  );
  app.all("*", (req, res) => res.send("404"));
}
