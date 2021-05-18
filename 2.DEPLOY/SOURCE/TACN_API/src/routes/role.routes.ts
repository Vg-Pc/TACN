import { RoleController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const role = new RoleController();

apiRoute.get("/", wrapHandlerWithJSONResponse(role.getListRole));

export default apiRoute;
