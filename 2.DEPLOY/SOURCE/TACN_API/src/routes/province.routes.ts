import { ProvinceController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const province = new ProvinceController();

apiRoute.get("/", wrapHandlerWithJSONResponse(province.getListProvince));

export default apiRoute;
