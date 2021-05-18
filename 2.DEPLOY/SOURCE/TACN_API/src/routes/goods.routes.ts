import {
  GoodsReceiptController,
  OrderController,
  GoodsReturnController,
} from "../controllers";
import { verifyJWT_MW } from "../config/middlewares";
import * as express from "express";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { pagingMiddleware } from "@middleware/pagingMiddleware";
const apiRoute = express.Router();

const goodsReceipt = new GoodsReceiptController();
const order = new OrderController();
const goodsReturn = new GoodsReturnController();

apiRoute
  .post(
    "/receive",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(goodsReceipt.receiveGoods)
  )
  .post(
    "/return",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(goodsReturn.returnGoods)
  )
  .delete(
    "/receive",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(goodsReceipt.deleteGoodsReceipt)
  )
  .put(
    "/receive",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(goodsReceipt.updateReceiptGoods)
  )
  .put(
    "/return",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(goodsReturn.updateGoodsReturn)
  )
  .delete(
    "/return",
    verifyJWT_MW,
    wrapHandlerWithJSONResponse(goodsReturn.deleteGoodsReturn)
  )
  .get(
    "/product-of-store",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(goodsReceipt.getListProductOfStore)
  )
  .get(
    "/product-receipt",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(goodsReceipt.getListProductReceipt)
  )
  .get(
    "/product-return",
    verifyJWT_MW,
    pagingMiddleware,
    wrapHandlerWithJSONResponse(goodsReturn.getListProductReturn)
  );

export default apiRoute;
