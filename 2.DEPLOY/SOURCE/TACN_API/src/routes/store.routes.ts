import { StoreController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const store = new StoreController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(store.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(store.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(store.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(store.getListStore)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(store.getStoreDetail)
  );

export default apiRoute;
