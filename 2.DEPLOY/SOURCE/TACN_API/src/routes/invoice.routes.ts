import { InvoiceController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const invoice = new InvoiceController();

apiRoute
  .post("/", verifyJWT_MW, wrapHandlerWithJSONResponse(invoice.create))
  .put("/", verifyJWT_MW, wrapHandlerWithJSONResponse(invoice.update))
  .delete("/", verifyJWT_MW, wrapHandlerWithJSONResponse(invoice.delete))
  .get(
    "/",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(invoice.getListInvoice)
  )
  .get(
    "/:id",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(invoice.getInvoiceDetail)
  );

export default apiRoute;
