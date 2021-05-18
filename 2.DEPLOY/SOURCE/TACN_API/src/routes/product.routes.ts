import { ProductController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const product = new ProductController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(product.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(product.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(product.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(product.getListProduct)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(product.getProductDetail)
  );

export default apiRoute;
