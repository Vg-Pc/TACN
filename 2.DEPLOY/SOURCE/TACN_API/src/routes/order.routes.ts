import { OrderController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const order = new OrderController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(order.create))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(order.getListOrder)
  )
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(order.updateOrder))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(order.deleteOrder))
  .get("/:id", verifyJWT_MW, wrapHandlerWithJSONResponse(order.getOrderDetail));

export default apiRoute;
