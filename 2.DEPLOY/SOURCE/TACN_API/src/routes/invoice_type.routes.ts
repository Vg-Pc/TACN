import { InvoiceTypeController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const invoiceType = new InvoiceTypeController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(invoiceType.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(invoiceType.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(invoiceType.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(invoiceType.getListInvoiceType)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(invoiceType.getInvoiceTypeDetail)
  );

export default apiRoute;
