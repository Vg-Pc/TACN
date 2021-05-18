import { ProductCategoryController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const productCategory = new ProductCategoryController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(productCategory.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(productCategory.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(productCategory.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(productCategory.getListProductCategory)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(productCategory.getProductCategoryDetail)
  );

export default apiRoute;
