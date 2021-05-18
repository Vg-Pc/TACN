import { SupplierController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const supplier = new SupplierController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(supplier.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(supplier.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(supplier.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(supplier.getListSupplier)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(supplier.getSupplierDetail)
  );

export default apiRoute;
