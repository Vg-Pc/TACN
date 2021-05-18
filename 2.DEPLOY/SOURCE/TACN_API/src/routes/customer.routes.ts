import { CustomerController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const customer = new CustomerController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(customer.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(customer.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(customer.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(customer.getListCustomer)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(customer.getCustomerDetail)
  );

export default apiRoute;
