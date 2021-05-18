import { ReportController } from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import {
  pagingMiddleware,
  pagingTranSaction,
} from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const report = new ReportController();

apiRoute
  .get(
    "/payment",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListPayment)
  )
  .get(
    "/profit",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getProfit)
  )
  .get(
    "/debt",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListDebt)
  )
  .get(
    "/order",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListOrder)
  )
  .get(
    "/goods-receipt",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListGoodsReceipt)
  )
  .get(
    "/goods-issue",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListGoodsIssue)
  )
  .get(
    "/goods-return",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListGoodsReturn)
  )
  .get(
    "/funds-book",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(report.getListFundsbook)
  )
  .get(
    "/transaction",
    verifyJWT_MW,
    pagingTranSaction,
    wrapHandlerWithJSONResponse(report.getListTransaction)
  )
  .get(
    "/history",
    verifyJWT_MW,
    pagingTranSaction,
    wrapHandlerWithJSONResponse(report.getListHistory)
  );

export default apiRoute;
