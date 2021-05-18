import "module-alias/register";
import * as express from "express";
import * as winston from "winston";
import * as morgan from "morgan";
import * as cors from "cors";
import { json, urlencoded } from "body-parser";
import { Express } from "express";
import * as routes from "./routes/";
import { environment } from "./config/";

const PORT: number = environment.port || 3000;

export class Server {
  private app: Express;

  constructor() {
    this.app = express();

    // Express middleware
    this.app.use(express.static(__dirname + "/uploads"));
    this.app.use(
      cors({
        optionsSuccessStatus: 200,
      })
    );
    this.app.use(
      urlencoded({
        extended: true,
      })
    );
    this.app.use(json());
    this.app.use(morgan("combined"));
    // this.app.use(upload.any());
    this.app.listen(PORT, () => {
      winston.log("info", "--> Server successfully started at port %d", PORT);
    });
    routes.initRoutes(this.app);
  }

  getApp() {
    return this.app;
  }
}
new Server();
