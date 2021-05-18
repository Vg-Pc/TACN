import * as winston from "winston";

import userRouter from "./user.routes";
import customerRouter from "./customer.routes";
import supplierRouter from "./supplier.routes";
import productRouter from "./product.routes";
import unitRouter from "./unit.routes";
import storeRouter from "./store.routes";
import goodsReceiptRouter from "./goods.routes";
import productCategoryRouter from "./product_category.routes";
import provinceRouter from "./province.routes";
import roleRouter from "./role.routes";
import invoiceTypeRouter from "./invoice_type.routes";
import orderRouter from "./order.routes";
import invoiceRouter from "./invoice.routes";
import reportRouter from "./report.routes";
import { UsersController } from "../controllers";
import statisticRouter from "./statistic.routes";
import { wrapHandlerWithJSONResponse } from "@commons/response";
import { uploadMiddleware } from "@middleware/uploadMiddleware";
const users = new UsersController();

export function initRoutes(app, router) {
  winston.log("info", "--> Initialisations des routes");

  router
    .get("/", (req, res) =>
      res.status(200).send({ message: "Api Server is running!" })
    )
    .put("/login", wrapHandlerWithJSONResponse(users.login))
    .post(
      "/image",
      uploadMiddleware(),
      wrapHandlerWithJSONResponse(async (req, res) => req.file)
    );

  router.use("/users", userRouter);
  router.use("/customer", customerRouter);
  router.use("/supplier", supplierRouter);
  router.use("/product-category", productCategoryRouter);
  router.use("/product", productRouter);
  router.use("/unit", unitRouter);
  router.use("/store", storeRouter);
  router.use("/goods", goodsReceiptRouter);
  router.use("/province", provinceRouter);
  router.use("/role", roleRouter);
  router.use("/invoice-type", invoiceTypeRouter);
  router.use("/order", orderRouter);
  router.use("/invoice", invoiceRouter);
  router.use("/report", reportRouter);
  router.use("/statistic", statisticRouter);
  return router;
}
