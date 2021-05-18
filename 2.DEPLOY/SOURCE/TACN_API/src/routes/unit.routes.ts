import { UnitController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const unit = new UnitController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(unit.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(unit.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(unit.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(unit.getListUnit)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(unit.getListDetailUnit)
  );

export default apiRoute;
