import { StatisticController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();
const statistic = new StatisticController();

apiRoute
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(statistic.statistic)
  )
  // .get(
  //   "/topSellingProducts",
  //   verifyJWT_MW,
  //   pagingMiddleware,
  //   wrapHandlerWithJSONResponse(statistic.topSellingProducts)
  // )
  // .get(
  //   "/schemaRevenue",
  //   verifyJWT_MW,
  //   pagingMiddleware,
  //   wrapHandlerWithJSONResponse(statistic.schemaRevenue)
  // )
  ;

export default apiRoute;
