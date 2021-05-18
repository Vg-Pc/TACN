import {
  IS_ACTIVE,
  apiCode,
  USER_STATUS,
  SALE_TYPE,
  VOUCHER,
} from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";
const { QueryTypes } = require("sequelize");

import transaction from "sequelize/types/lib/transaction";
import { query } from "@middleware/handleRequestMiddleware";

const db = require("@models");
const {
  sequelize,
  Sequelize,
  Product,
  OrderProduct,
  ProductOfStore,
  Order,
  Invoice,
} = db.default;
const { Op } = Sequelize;
export class StatisticController extends ApplicationController {
  constructor() {
    super("Order");
  }
  statistic = async (req, res) => {
    let sumTotalPrice: number;
    let countInvoice: number;
    let orders: number;
    let returnGoods: number;
    let productOfStore: number;
    const schema = Joi.object({
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);
    // console.log("query", req.query);
    const { store_id } = await schema.validateAsync(req.query);
    // return store_id;
    const storeIdQuery = store_id ? "= :store_id" : "IS NOT NULL";
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      to_date = Date.now() / 1000;
      from_date = to_date - 86400 * 30;
    }
    let unix_timestamp_fromDate = from_date;
    const date_fromDate = new Date(unix_timestamp_fromDate * 1000);
    const day_fromDate = date_fromDate.getDate();
    const month_fromDate = date_fromDate.getMonth() + 1;
    const year_fromDate = date_fromDate.getFullYear();
    const formatTimeFromDate =
      day_fromDate > 9
        ? year_fromDate + "-" + "0" + month_fromDate + "-" + "0" + day_fromDate
        : year_fromDate + "-" + "0" + month_fromDate + "-" + day_fromDate;
    let formatTimeFromDateToTimstamp =
      new Date(formatTimeFromDate).getTime() / 1000;
    console.log(formatTimeFromDateToTimstamp);
    let unix_timestamp_toDate = to_date;
    const date_toDate = new Date(unix_timestamp_toDate * 1000);
    const day_toDate = date_toDate.getDate();
    const month_toDate = date_toDate.getMonth() + 1;
    const year_toDate = date_toDate.getFullYear();
    const formatTimeToDate =
      day_toDate > 9
        ? year_toDate + "-" + "0" + month_toDate + "-" + "0" + day_toDate
        : year_toDate + "-" + "0" + month_toDate + "-" + day_toDate;
    let formatTimeTodateToTimestamp =
      new Date(formatTimeToDate).getTime() / 1000;
    console.log(formatTimeTodateToTimestamp);
    // return { formatTimeFromDateToTimstamp, formatTimeTodateToTimestamp };
    /*------ STATISTIC ------*/
    const options = {
      [Op.and]: [
        { created_at: { [Op.gte]: formatTimeFromDateToTimstamp } },
        { created_at: { [Op.lte]: formatTimeTodateToTimestamp } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };
    Promise.all([
      (sumTotalPrice = await Order.sum("paid_price", {
        where: {
          ...options,
          store_id: store_id || { [Op.ne]: null },
        },
        logging: console.log,
      })),
      (countInvoice = await Invoice.sum("amount", {
        where: {
          voucher_type: VOUCHER.RECEIPT,
          ...options,
        },
        logging: console.log,
      })),
      (orders = await Order.count({
        where: {
          [Op.or]: [
            { sale_type: SALE_TYPE.WHOLESALE },
            {
              sale_type: SALE_TYPE.RETAIL,
            },
          ],
          store_id: store_id || { [Op.ne]: null },
          ...options,
        },
        logging: console.log,
      })),
      (returnGoods = await Order.count({
        where: {
          sale_type: SALE_TYPE.RETURN,
          store_id: store_id || { [Op.ne]: null },
          ...options,
        },
        logging: console.log,
      })),
      (productOfStore = await ProductOfStore.sum("amount", {
        where: {
          ...options,
          store_id: store_id || { [Op.ne]: null },
        },
        logging: console.log,
      })),
    ]);
    if (!productOfStore) {
      productOfStore = 0;
    }
    if (!sumTotalPrice) {
      sumTotalPrice = 0;
    }
    if (!countInvoice) {
      countInvoice = 0;
    }
    const revenue = sumTotalPrice + countInvoice;
    //return sumTotalPrice;
    /*----- TOPSELLINGPRODUCT -----*/
    const midQueryIdStore = `
    SELECT 
    \`order\`.id
    FROM \`order\` 
    WHERE \`order\`.store_id ${storeIdQuery} AND \`order\`.is_active= :is_active 
    AND (\`order\`.\`created_at\` >= :from_date AND \`order\`.\`created_at\` <= :to_date)
    AND (\`order\`.\`agent_id\`= :agent_id)
    `;
    const _midQueryIdStore = await sequelize.query(midQueryIdStore, {
      type: QueryTypes.SELECT,
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        from_date: formatTimeFromDateToTimstamp,
        to_date: formatTimeTodateToTimestamp,
        store_id: store_id,
        agent_id: req.user.agent_id,
      },
    });
    let arrayId = [];
    const length_midQueryIdStore = _midQueryIdStore.length;
    for (let index = 0; index < length_midQueryIdStore; index++) {
      arrayId.push(_midQueryIdStore[index].id);
    }
    const orderProduct = await OrderProduct.findAll({
      attributes: [
        [
          sequelize.fn(
            "JSON_EXTRACT",
            sequelize.col("product"),
            "$.product_code"
          ),
          "product_code",
        ],
        [
          sequelize.fn(
            "JSON_EXTRACT",
            sequelize.col("product"),
            "$.product_name"
          ),
          "product_name",
        ],
        [sequelize.fn("SUM", sequelize.col("amount")), "top_selling"],
      ],
      where: {
        order_id: { [Op.in]: arrayId },
        is_active: IS_ACTIVE.ACTIVE,
        [Op.and]: [
          { created_at: { [Op.gte]: formatTimeFromDateToTimstamp } },
          { created_at: { [Op.lte]: formatTimeTodateToTimestamp } },
        ],
        agent_id: req.user.agent_id,
      },
      group: ["product_code"],
      logging: console.log,
    });
    //return orderProduct;
    let topSellingProduct = [];
    if (orderProduct) {
      orderProduct.sort(function (a: any, b: any) {
        return b.get("top_selling") - a.get("top_selling");
      });
      //return orderProduct;
      for (let i = 0; i < 10; i++) {
        topSellingProduct.push(orderProduct[i]);
        if (!orderProduct[i + 1]) {
          break;
        }
      }
    }
    // return topSellingProduct;
    /*----- SCHEMAREVENUE -----*/
    let arrayRevenue = [];
    const distance = Math.round(
      (formatTimeTodateToTimestamp - formatTimeFromDateToTimstamp) / 86400
    );
    let revenues: Number;
    for (let i = 0; i <= distance; i++) {
      const midQueryRetailWhole = `
      SELECT
      (SELECT SUM(paid_price) FROM tacn.order WHERE (created_at >= ${formatTimeFromDateToTimstamp} AND created_at < ${formatTimeFromDateToTimstamp} + 86400) AND is_active= :is_active
      AND store_id ${storeIdQuery} AND agent_id= :agent_id)
      AS retail_wholesale
      `;
      const midQueryInvoice = `
      SELECT
      (SELECT SUM(invoice.amount) FROM tacn.invoice WHERE (created_at >= ${formatTimeFromDateToTimstamp} AND created_at < ${formatTimeFromDateToTimstamp} + 86400
      ) AND invoice.voucher_type = :receipt AND is_active= :is_active AND agent_id= :agent_id) AS invoice
      `;
      let queryRetailWhole: object[];
      let queryInvoice: object[];
      Promise.all([
        (queryRetailWhole = await sequelize.query(midQueryRetailWhole, {
          type: QueryTypes.SELECT,
          replacements: {
            is_active: IS_ACTIVE.ACTIVE,
            store_id: store_id,
            agent_id: req.user.agent_id,
          },
        })),
        (queryInvoice = await sequelize.query(midQueryInvoice, {
          type: QueryTypes.SELECT,
          replacements: {
            is_active: IS_ACTIVE.ACTIVE,
            receipt: VOUCHER.RECEIPT,
            agent_id: req.user.agent_id,
          },
        })),
      ]);
      if (!queryRetailWhole[0]["retail_wholesale"]) {
        queryRetailWhole[0]["retail_wholesale"] = 0;
      }
      if (!queryInvoice[0]["invoice"]) {
        queryInvoice[0]["invoice"] = 0;
      }
      console.log(i, formatTimeFromDateToTimstamp);
      console.log(queryRetailWhole);
      console.log(queryInvoice);
      revenues =
        Number(queryRetailWhole[0]["retail_wholesale"]) +
        Number(queryInvoice[0]["invoice"]);
      const date = new Date(formatTimeFromDateToTimstamp * 1000);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedTime = day + "-" + month + "-" + year;
      // đặt biến để convert timstamp --> ngày tháng
      // sau đó push biến đó vào mảng revenue
      arrayRevenue.push({ revenues, formattedTime });
      formatTimeFromDateToTimstamp =
        Number(formatTimeFromDateToTimstamp) + 86400;
      // return formatTimeFromDateToTimstamp;
    }
    console.log(arrayRevenue);
    return {
      orders,
      returnGoods,
      revenue,
      productOfStore,
      topSellingProduct: topSellingProduct,
      arrayRevenue,
    };
  };
  // topSellingProducts = async (req, res) => {
  //   const getProduct = await OrderProduct.findAll({
  //     attributes: ["product"],
  //     logging: console.log,
  //   });

  //   getProduct.sort(function (a, b) {
  //     return b.product.amount - a.product.amount;
  //   });
  //   let topProducts = [];
  //   for (let i = 0; i < 10; i++) {
  //     topProducts.push(getProduct[i]);
  //   }
  //   return topProducts;
  // };
  /*
  topSellingProducts = async (req, res) => {
    const schema = Joi.object()
      .keys({
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
      })
      .unknown(true);
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const query = `
    SELECT 
    JSON_EXTRACT(\`order_product\`.\`product\`,'$.product_code') AS \`product_code\`,
    \`product\`.\`name\`,
    SUM(\`order_product\`.\`amount\`) AS \`top_selling\`
    FROM \`order_product\` LEFT JOIN \`product\` ON JSON_CONTAINS(\`order_product\`.\`product\`, JSON_QUOTE(\`product\`.\`code\`),'$.product_code')
    WHERE (\`order_product\`.\`created_at\` >= :from_date AND \`order_product\`.\`created_at\` <= :to_date) AND \`order_product\`.\`is_active\`= :is_active
    GROUP BY \`product_code\`
    `;
    const _query = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        from_date: from_date,
        to_date: to_date,
      },
      logging: console.log,
    });
    _query.sort(function (a: any, b: any) {
      return b.top_selling - a.top_selling;
    });
    let topSellingProduct = [];
    for (let i = 0; i < 10; i++) {
      topSellingProduct.push(_query[i]);
      if (!_query[i + 1]) {
        break;
      }
    }
    return topSellingProduct;
  };
  /*
  schemaRevenue = async (req, res) => {
    let midQuery;
    let arrRevenue=[];
    for (let month = 1; month <= 12; month++) {
      midQuery = `
      SELECT
      (SELECT SUM(retail_price + wholesale_price) FROM tacn.product WHERE created_at>= ${month} AND created_at <= ${
        month + 1
      }) + (SELECT SUM(amount) FROM tacn.invoice where voucher_type = 1 ) as revenue,
      '${month}' as month
      `;
      const query = sequelize.query(midQuery, {
        type: QueryTypes.SELECT,
      });
      let arr = [];
      arr.concat(query);
      arr.concat(query)[0];
      arrRevenue.push(arr.concat(query)[0])
    }

    return arrRevenue;
  };
*/
  /*
  schemaRevenue = async (req, res) => {
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      to_date = Date.now() / 1000;
      from_date = to_date - 86400 * 30;
    }
    let arrayRevenue = [];
    const distance = Math.round((to_date - from_date) / 86400);
    let revenues: Number;
    for (let i = 0; i <= distance; i++) {
      const midQueryRetailWhole = `
      SELECT
      (SELECT SUM(total_price) FROM tacn.order WHERE (created_at >= ${from_date} AND created_at < ${from_date}+ 86400) AND is_active= :is_active)
      AS retail_wholesale
      `;
      const midQueryInvoice = `
      SELECT
      (SELECT SUM(invoice.amount) FROM tacn.invoice WHERE (created_at >= ${from_date} AND created_at < ${from_date} + 86400
      ) AND invoice.voucher_type = 1 AND is_active= :is_active) AS invoice
      `;
      let queryRetailWhole: object[];
      let queryInvoice: object[];
      Promise.all([
        (queryRetailWhole = await sequelize.query(midQueryRetailWhole, {
          type: QueryTypes.SELECT,
          replacements: { is_active: IS_ACTIVE.ACTIVE },
        })),
        (queryInvoice = await sequelize.query(midQueryInvoice, {
          type: QueryTypes.SELECT,
          replacements: { is_active: IS_ACTIVE.ACTIVE },
        })),
      ]);
      if (!queryRetailWhole[0]["retail_wholesale"]) {
        queryRetailWhole[0]["retail_wholesale"] = 0;
      }
      if (!queryInvoice[0]["invoice"]) {
        queryInvoice[0]["invoice"] = 0;
      }
      console.log(queryRetailWhole);
      console.log(queryInvoice);
      revenues =
        Number(queryRetailWhole[0]["retail_wholesale"]) +
        Number(queryInvoice[0]["invoice"]);
      const date = new Date(from_date * 1000);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedTime = day + "-" + month + "-" + year;
      // đặt biến để convert timstamp --> ngày tháng
      // sau đó push biến đó vào mảng revenue
      arrayRevenue.push({ revenues, formattedTime });
      from_date = Number(from_date) + 86400;
      // return from_date;
    }
    console.log(arrayRevenue);
    return arrayRevenue;
  };
  // let retail;
  // let wholesale;
  // let from_dateNext = from_date + 86400;
  // const queryRetail = `
  // SELECT
  // (SELECT SUM(product.retail_price) FROM product WHERE created_at >= ${from_date} AND created_at <= ${from_date}+ 86400 ) AS retail`;
  // retail = await sequelize.query(queryRetail, {
  //   type: QueryTypes.SELECT,
  // });
  // const queryWholesale = `
  // SELECT
  // (SELECT SUM(product.wholesale_price) FROM product WHERE created_at >= ${from_date} AND created_at <=  ${from_date} +86400) AS wholesale`;
  // wholesale = await sequelize.query(queryWholesale, {
  //   type: QueryTypes.SELECT,
  // });
  // const revenue = retail[0]["retail"] + wholesale[0]["wholesale"];
  // return revenue;
  */

  /*
    const query = `
    SELECT 
    JSON_EXTRACT(\`order_product\`.\`product\`,'$.product_code') AS \`product_code\`,
    JSON_EXTRACT(\`order_product\`.\`product\`,'$.store_id') AS \`store_id\`,
    SUM(\`order_product\`.\`amount\`) AS \`top_selling\`
    FROM \`order_product\` LEFT JOIN \`product\` ON JSON_CONTAINS(\`order_product\`.\`product\`, JSON_QUOTE(\`product\`.\`code\`),'$.product_code')
    WHERE 
    (\`order_product\`.\`created_at\` >= :from_date AND \`order_product\`.\`created_at\` <= :to_date)
    AND \`order_product\`.\`is_active\`= :is_active
    AND \`order_product\`.\`order_id\` IN (146 , 148,
        149,
        150,
        151,
        152,
        195,
        198,
        199)
    GROUP BY \`product_code\`
    `;
    const _query = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        from_date: formatTimeFromDateToTimstamp,
        to_date: formatTimeTodateToTimestamp,
        store_id: store_id,
      },
      logging: console.log,
    });
    return _query[0].top_selling;
    return _query.sort(function (a: any, b: any) {
      return b.top_selling - a.top_selling;
    });
    let topSellingProduct = [];
    for (let i = 0; i < 10; i++) {
      topSellingProduct.push(_query[i]);
      if (!_query[i + 1]) {
        break;
      }
    }
    return topSellingProduct;
*/
}
