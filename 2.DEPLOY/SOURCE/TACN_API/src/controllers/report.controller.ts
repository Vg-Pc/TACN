import {
  IS_ACTIVE,
  apiCode,
  VOUCHER,
  INVOICE_OBJECT,
  SALE_TYPE,
  TRANSACTION_TYPE,
} from "@utils/constant";
import { ApplicationController, GoodsReceiptController } from ".";
import * as Joi from "joi";
import model from "sequelize/types/lib/model";
import { date } from "joi";
import { keys } from "lodash";

const db = require("@models");
const {
  Province,
  sequelize,
  Sequelize,
  Customer,
  Order,
  Invoice,
  Store,
  User,
  OrderProduct,
  Supplier,
  GoodsReturn,
  GoodsReceipt,
} = db.default;
const { Op } = Sequelize;
const { QueryTypes } = require("sequelize");

const attributesUser = {};
export class ReportController extends ApplicationController {
  constructor() {
    super("Report");
  }

  getListPayment = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      customer_id: Joi.number().integer().allow(null, ""),
      supplier_id: Joi.number().integer().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      // invoice_type_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, customer_id, store_id, invoice_type_id, supplier_id } =
      await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };
    // return options;

    // if (customer_id) options["id"] = customer_id;
    // if (customer_id) options["id"] = customer_id;

    let totalInvoiceCustomer;
    let totalInvoiceSupplier;
    let totalOrderCustomer;
    let totalOrderSuplier;
    let totalReturnPrice;
    await Promise.all([
      (totalInvoiceCustomer = await Invoice.sum("amount", {
        where: {
          ...options,
          customer_id: customer_id || { [Op.ne]: null },
          voucher_type: VOUCHER.RECEIPT,
          // invoice_type_id: invoice_type_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalInvoiceSupplier = await Invoice.sum("amount", {
        where: {
          ...options,
          supplier_id: supplier_id || { [Op.ne]: null },
          voucher_type: VOUCHER.RECEIPT,
          // invoice_type_id: invoice_type_id || { [Op.ne]: null },
        },
        include: [{ model: Supplier, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalOrderCustomer = await Order.sum("paid_price", {
        where: {
          ...options,
          store_id: store_id || { [Op.ne]: null },
          sale_type: { [Op.ne]: SALE_TYPE.RETURN },
          customer_id: customer_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalOrderSuplier = await GoodsReceipt.sum("paid_price", {
        where: {
          ...options,
          store_id: store_id || { [Op.ne]: null },
          supplier_id: supplier_id || { [Op.ne]: null },
        },
        include: [{ model: Supplier, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      // return totalOrderPrice;

      (totalReturnPrice = await Order.sum("paid_price", {
        where: {
          ...options,
          customer_id: customer_id || { [Op.ne]: null },
          sale_type: SALE_TYPE.RETURN,
          store_id: store_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
    ]);

    let totalPaymentCustomer: number;
    let totalPaymentSupplier: number;

    totalPaymentCustomer = customer_id
      ? (totalOrderCustomer || 0) +
      (totalInvoiceCustomer || 0) -
      (totalReturnPrice || 0)
      : 0;
    totalPaymentSupplier = supplier_id
      ? (totalOrderSuplier || 0) + (totalInvoiceSupplier || 0)
      : 0;
    if (!customer_id && !supplier_id) {
      totalPaymentCustomer =
        (totalOrderCustomer || 0) +
        (totalInvoiceCustomer || 0) -
        (totalReturnPrice || 0);
      totalPaymentSupplier =
        (totalOrderSuplier || 0) + (totalInvoiceSupplier || 0);
    }

    let queryCustomerId;
    let querySupplierId;
    const queryStoreId = store_id ? "=:store_id" : "IS NOT NULL";
    if (customer_id || supplier_id) {
      queryCustomerId = customer_id ? "=:customer_id" : "IS NULL";
      querySupplierId = supplier_id ? "=:supplier_id" : "IS NULL";
    }
    if (!customer_id && !supplier_id) {
      queryCustomerId = customer_id ? "=:customer_id" : "IS NOT NULL";
      querySupplierId = supplier_id ? "=:supplier_id" : "IS NOT NULL";
    }
    // return querySupplierId;
    // return querySupplierId;
    // return queryCustomerId;
    const midQuery = `
    SELECT * from 
   (SELECT 
   \`Customer\`.\`id\`,
   \`Customer\`.\`code\`,
   \`Customer\`.\`name\`,
   \`Customer\`.\`phone_number\`,
   "${totalPaymentCustomer}" as total_price,
   (SELECT 
      IFNULL(SUM(\`orders\`.\`paid_price\`), 0)
      FROM
        \`order\` AS orders
      WHERE
        \`orders\`.\`customer_id\` = \`Customer\`.\`id\`
            AND \`orders\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
            AND (\`orders\`.\`store_id\` ${queryStoreId})
            AND (\`orders\`.\`sale_type\` != ${SALE_TYPE.RETURN})
            AND (\`orders\`.\`created_at\` >= ${from_date} AND \`orders\`.\`created_at\` <= ${to_date})
            AND orders.store_id IS NOT NULL) AS \`order_price\`,
    (SELECT 
            IFNULL(SUM(\`invoice\`.\`amount\`), 0)
        FROM
            \`invoice\` AS invoice
        WHERE
                \`invoice\`.\`customer_id\` = Customer.id
                AND \`invoice\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
                AND \`invoice\`.\`voucher_type\` = ${VOUCHER.RECEIPT}
                AND (\`invoice\`.\`created_at\` >= ${from_date} AND \`invoice\`.\`created_at\` <= ${to_date})
                AND \`invoice\`.\`invoice_type_id\` IS NOT NULL) AS \`invoice_price\`,
    (SELECT 
      IFNULL(SUM(\`orders\`.\`paid_price\`), 0)
      FROM
        \`order\` AS orders
      WHERE
        \`orders\`.\`customer_id\` = \`Customer\`.\`id\`
            AND \`orders\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
            AND (\`orders\`.\`store_id\` ${queryStoreId})
            AND (\`orders\`.\`sale_type\` != ${SALE_TYPE.RETAIL})
            AND (\`orders\`.\`sale_type\` != ${SALE_TYPE.WHOLESALE})
            AND (\`orders\`.\`created_at\` >= ${from_date} AND \`orders\`.\`created_at\` <= ${to_date})
            AND orders.store_id IS NOT NULL) AS \`return_prices\`
   FROM 
   \`customer\` AS \`Customer\`
   WHERE 
   (\`Customer\`.\`name\` LIKE '%${search}%'
     OR \`Customer\`.\`phone_number\` LIKE '%${search}%'
   )
   AND (\`Customer\`.\`id\` ${queryCustomerId})
   AND (\`Customer\`.\`created_at\` >= ${from_date} AND \`Customer\`.\`created_at\` <= ${to_date})
   AND \`Customer\`.\`is_active\`= 1
   UNION
   SELECT
   \`Supplier\`.\`id\`,
   \`Supplier\`.\`code\`,
   \`Supplier\`.\`name\`,
   \`Supplier\`.\`phone_number\`,
   "${totalPaymentSupplier}" as total_price,
   0 as return_price,
   (SELECT
      IFNULL(SUM(\`goods_receipt\`.\`paid_price\`), 0)
      FROM
        \`goods_receipt\` AS goods_receipt
      WHERE
        \`goods_receipt\`.\`supplier_id\` = \`Supplier\`.\`id\`
            AND \`goods_receipt\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
            AND (\`goods_receipt\`.\`store_id\` ${queryStoreId})
            AND (\`goods_receipt\`.\`created_at\` >= ${from_date} AND \`goods_receipt\`.\`created_at\` <= ${to_date})
            AND goods_receipt.store_id IS NOT NULL) AS \`order_price\`,
    (SELECT 
            IFNULL(SUM(\`invoice\`.\`amount\`), 0)
        FROM
            \`invoice\` AS invoice
        WHERE
                \`invoice\`.\`supplier_id\` = Supplier.id
                AND \`invoice\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
                AND \`invoice\`.\`voucher_type\` = ${VOUCHER.RECEIPT}
                AND (\`invoice\`.\`created_at\` >= ${from_date} AND \`invoice\`.\`created_at\` <= ${to_date})
                AND \`invoice\`.\`invoice_type_id\` IS NOT NULL) AS \`invoice_price\`
   FROM 
   \`supplier\` AS \`Supplier\`
   WHERE 
   (\`Supplier\`.\`name\` LIKE '%${search}%'
     OR \`Supplier\`.\`phone_number\` LIKE '%${search}%'
   )
   AND (\`Supplier\`.\`id\` ${querySupplierId})
   AND (\`Supplier\`.\`created_at\` >= ${from_date} AND \`Supplier\`.\`created_at\` <= ${to_date})
   AND \`Supplier\`.\`is_active\`= ${IS_ACTIVE.ACTIVE}) as report
   LIMIT :offset,:limit;`;

    //Count
    const midQueryCount = `
    SELECT * from 
   (SELECT 
   \`Customer\`.\`id\`,
   \`Customer\`.\`code\`,
   \`Customer\`.\`name\`,
   \`Customer\`.\`phone_number\`,
   "${totalPaymentCustomer}" as total_price,
  (SELECT 
      IFNULL(SUM(\`orders\`.\`paid_price\`), 0)
      FROM
        \`order\` AS orders
      WHERE
        \`orders\`.\`customer_id\` = \`Customer\`.\`id\`
            AND \`orders\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
            AND (\`orders\`.\`store_id\` ${queryStoreId})
            AND (\`orders\`.\`sale_type\` != ${SALE_TYPE.RETURN})
            AND (\`orders\`.\`created_at\` >= ${from_date} AND \`orders\`.\`created_at\` <= ${to_date})
            AND orders.store_id IS NOT NULL) AS \`order_price\`,
    (SELECT 
            IFNULL(SUM(\`invoice\`.\`amount\`), 0)
        FROM
            \`invoice\` AS invoice
        WHERE
                \`invoice\`.\`customer_id\` = Customer.id
                AND \`invoice\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
                AND \`invoice\`.\`voucher_type\` = ${VOUCHER.RECEIPT}
                AND (\`invoice\`.\`created_at\` >= ${from_date} AND \`invoice\`.\`created_at\` <= ${to_date})
                AND \`invoice\`.\`invoice_type_id\` IS NOT NULL) AS \`invoice_price\`,
    (SELECT 
      IFNULL(SUM(\`orders\`.\`paid_price\`), 0)
      FROM
        \`order\` AS orders
      WHERE
        \`orders\`.\`customer_id\` = \`Customer\`.\`id\`
            AND \`orders\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
            AND (\`orders\`.\`store_id\` ${queryStoreId})
            AND (\`orders\`.\`sale_type\` != ${SALE_TYPE.RETAIL})
            AND (\`orders\`.\`sale_type\` != ${SALE_TYPE.WHOLESALE})
            AND (\`orders\`.\`created_at\` >= ${from_date} AND \`orders\`.\`created_at\` <= ${to_date})
            AND orders.store_id IS NOT NULL) AS \`return_prices\`
   FROM 
   \`customer\` AS \`Customer\`
   WHERE 
   (\`Customer\`.\`name\` LIKE '%${search}%'
     OR \`Customer\`.\`phone_number\` LIKE '%${search}%'
   )
   AND (\`Customer\`.\`id\` ${queryCustomerId})
   AND (\`Customer\`.\`created_at\` >= ${from_date} AND \`Customer\`.\`created_at\` <= ${to_date})
   AND \`Customer\`.\`is_active\`= ${IS_ACTIVE.ACTIVE}
   UNION
   SELECT
   \`Supplier\`.\`id\`,
   \`Supplier\`.\`code\`,
   \`Supplier\`.\`name\`,
   \`Supplier\`.\`phone_number\`,
   "${totalPaymentSupplier}" as total_price,
   0 as return_price,
   (SELECT
      IFNULL(SUM(\`goods_receipt\`.\`paid_price\`), 0)
      FROM
        \`goods_receipt\` AS goods_receipt
      WHERE
        \`goods_receipt\`.\`supplier_id\` = \`Supplier\`.\`id\`
            AND \`goods_receipt\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
            AND (\`goods_receipt\`.\`store_id\` ${queryStoreId})
            AND (\`goods_receipt\`.\`created_at\` >= ${from_date} AND \`goods_receipt\`.\`created_at\` <= ${to_date})
            AND goods_receipt.store_id IS NOT NULL) AS \`order_price\`,
    (SELECT 
            IFNULL(SUM(\`invoice\`.\`amount\`), 0)
        FROM
            \`invoice\` AS invoice
        WHERE
                \`invoice\`.\`supplier_id\` = Supplier.id
                AND \`invoice\`.\`is_active\` = ${IS_ACTIVE.ACTIVE}
                AND \`invoice\`.\`voucher_type\` = ${VOUCHER.RECEIPT}
                AND (\`invoice\`.\`created_at\` >= ${from_date} AND \`invoice\`.\`created_at\` <= ${to_date})
                AND \`invoice\`.\`invoice_type_id\` IS NOT NULL) AS \`invoice_price\`
   FROM 
   \`supplier\` AS \`Supplier\`
   WHERE 
   (\`Supplier\`.\`name\` LIKE '%${search}%'
     OR \`Supplier\`.\`phone_number\` LIKE '%${search}%'
   )
   AND (\`Supplier\`.\`id\` ${querySupplierId})
   AND (\`Supplier\`.\`created_at\` >= ${from_date} AND \`Supplier\`.\`created_at\` <= ${to_date})
   AND \`Supplier\`.\`is_active\`= ${IS_ACTIVE.ACTIVE}) as report
   `;
    const query = await sequelize.query(midQuery, {
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        store_id: store_id,
        customer_id,
        supplier_id,
        offset,
        limit,
        page: page,
      },
      type: QueryTypes.SELECT,
      logging: console.log,
    });
    const querys = await sequelize.query(midQueryCount, {
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        store_id: store_id,
        customer_id,
        supplier_id,
      },
      type: QueryTypes.SELECT,
      logging: console.log,
    });
    return {
      data: query,
      total: totalPaymentCustomer + totalPaymentSupplier,
      paging: {
        page,
        totalItemCount: querys.length,
        limit,
      },
    };
  };

  getProfit = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      sale_type: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, store_id, sale_type } = await schema.validateAsync(
      req.query
    );

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      store_id: store_id || { [Op.ne]: null },
      sale_type: sale_type || {
        [Op.in]: [SALE_TYPE.WHOLESALE, SALE_TYPE.RETAIL],
      },
      agent_id: req.user.agent_id,
    };

    const totalPrice = await Order.sum("total_price", {
      where: options,
    });

    const query = `
    SELECT 
        SUM(product->"$.import_price") AS \`totalProfit\`
    FROM
        \`order_product\` AS \`OrderProduct\`
            INNER JOIN
        \`order\` AS \`Order\` ON \`OrderProduct\`.\`order_id\` = \`Order\`.\`id\`
            AND (\`Order\`.\`created_at\` >= :from_date
            AND \`Order\`.\`created_at\` <= :to_date)
            AND \`Order\`.\`is_active\` = :is_active
            AND \`Order\`.\`agent_id\` = :agent_id
            AND \`Order\`.\`store_id\` ${store_id ? `= ${store_id}` : "IS NOT NULL"
      }
            AND \`Order\`.\`sale_type\` ${sale_type
        ? `= ${sale_type}`
        : `IN (${SALE_TYPE.WHOLESALE}, ${SALE_TYPE.RETAIL})`
      }
    WHERE
        \`OrderProduct\`.\`is_active\` = :is_active;
      `;

    const { totalProfit } = (
      await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          from_date,
          to_date,
          is_active: IS_ACTIVE.ACTIVE,
          agent_id: req.user.agent_id,
        },
      })
    )[0];

    let data = await super._findAndCountAll(
      {
        where: { ...options, [Op.or]: [{ code: { [Op.substring]: search } }] },
        include: [{ model: Store, attributes: [] }],
        attributes: [
          "id",
          "code",
          "sale_type",
          "created_at",
          [sequelize.col("Store.name"), "store_name"],
          "goods_price",
          [sequelize.literal("goods_price - total_price"), "discount"],
          "total_price",
          // [
          //   sequelize.literal(`(
          //       SELECT IFNULL(SUM(JSON_EXTRACT(product, "$.import_price")),0)
          //       FROM tacn.order_product AS order_product
          //       WHERE
          //           order_product.order_id = Order.id AND
          //           order_product.is_active = ${IS_ACTIVE.ACTIVE}
          //   )`),
          //   "import_price",
          // ],
          [
            sequelize.literal(`(
                SELECT IFNULL(SUM(JSON_EXTRACT(product, "$.import_price")* order_product.amount),0)
                FROM tacn.order_product AS order_product
                WHERE
                    order_product.order_id = Order.id AND
                    order_product.is_active = ${IS_ACTIVE.ACTIVE}
            )`),
            "tong_gia_von",
          ],
          [
            sequelize.literal(`(
              SELECT IFNULL(Order.total_price - IFNULL(SUM(JSON_EXTRACT(product, "$.import_price") * order_product.amount),0),0)
              FROM tacn.order_product AS order_product
              WHERE
                  order_product.order_id = Order.id AND
                  order_product.is_active = ${IS_ACTIVE.ACTIVE}
          )`),
            "profit",
          ],
        ],
        order: [["id", "DESC"]],
        limit,
        offset,
      },
      page,
      "Order"
    );

    data.data = {
      total: (totalPrice || 0) - (totalProfit || 0),
      data: data.data,
    };

    return data;
  };

  getListDebt = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      object: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    let { search, object } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }

    if (!object) object = INVOICE_OBJECT.CUSTOMER;

    const where = {
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      [Op.or]: [{ name: { [Op.substring]: search } }],
      agent_id: req.user.agent_id,
    };

    const options = {
      where,
      attributes: [
        "id",
        "code",
        "name",
        "phone_number",
        "email",
        [sequelize.literal(object), "object"],
        [sequelize.col("Province.name"), "province_name"],
        "debt",
      ],
      include: [
        {
          model: Province,
          where: { is_active: IS_ACTIVE.ACTIVE },
          attributes: [],
        },
      ],
      order: [["id", "DESC"]],
      limit,
      offset,
    };

    const total = await db.default[
      object == INVOICE_OBJECT.SUPPLIER ? "Supplier" : "Customer"
    ].sum("debt", { where });

    const data = await super._findAndCountAll(
      options,
      page,
      object == INVOICE_OBJECT.SUPPLIER ? "Supplier" : "Customer"
    );

    data.data = {
      total,
      data: data.data,
    };

    return data;
  };

  getListOrder = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      customer_id: Joi.number().integer().allow(null, ""),
      staff_id: Joi.number().integer().allow(null, ""),
      sale_type: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, store_id, sale_type, customer_id, staff_id } =
      await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      store_id: store_id || { [Op.ne]: null },
      customer_id: customer_id || { [Op.ne]: null },
      staff_id: staff_id || { [Op.ne]: null },
      sale_type: sale_type || { [Op.ne]: null },
      agent_id: req.user.agent_id,
    };

    const totalPrice = await Order.sum("total_price", {
      where: {
        ...options,
        sale_type: { [Op.in]: [SALE_TYPE.WHOLESALE, SALE_TYPE.RETAIL] },
      },
    });

    const totalReturn = await Order.sum("total_price", {
      where: {
        ...options,
        sale_type: SALE_TYPE.RETURN,
      },
    });

    let data = await super._findAndCountAll(
      {
        where: { ...options, [Op.or]: [{ code: { [Op.substring]: search } }] },
        include: [
          { model: Store, attributes: [] },
          { model: User, attributes: [] },
          { model: Customer, attributes: [] },
        ],
        attributes: [
          "id",
          "code",
          "sale_type",
          "created_at",
          [sequelize.col("Customer.name"), "customer_name"],
          [sequelize.col("User.name"), "staff_name"],
          [sequelize.col("Store.name"), "store_name"],
          "goods_price",
          [sequelize.literal("goods_price-total_price"), "discount"],
          "total_price",
          [
            sequelize.literal(`(
              SELECT IFNULL(SUM(JSON_EXTRACT(product, "$.import_price")),0)
              FROM tacn.order_product AS order_product
              WHERE
                  order_product.order_id = Order.id AND
                  order_product.is_active = ${IS_ACTIVE.ACTIVE}
          )`),
            "import_price",
          ],
          // [
          //   sequelize.literal(`(
          //     SELECT IFNULL(Order.total_price - IFNULL(SUM(JSON_EXTRACT(product, "$.import_price")),0),0)
          //     FROM tacn.order_product AS order_product
          //     WHERE
          //         order_product.order_id = Order.id AND
          //         order_product.is_active = ${IS_ACTIVE.ACTIVE}
          // )`),
          //   "profit",
          // ],
        ],
        order: [["id", "DESC"]],
        limit,
        offset,
        logging: console.log,
      },
      page,
      "Order"
    );

    data.data = {
      total: (totalPrice || 0) - (totalReturn || 0),
      whole_sale: await Order.count({
        where: {
          ...options,
          sale_type: SALE_TYPE.WHOLESALE,
        },
      }),
      retail: await Order.count({
        where: {
          ...options,
          sale_type: SALE_TYPE.RETAIL,
        },
      }),
      return: await Order.count({
        where: {
          ...options,
          sale_type: SALE_TYPE.RETURN,
        },
      }),
      data: data.data,
    };

    return data;
  };

  getListGoodsReceipt = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      supplier_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, store_id, supplier_id } = await schema.validateAsync(
      req.query
    );

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      is_active: IS_ACTIVE.ACTIVE,
      id: supplier_id || { [Op.ne]: null },
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      agent_id: req.user.agent_id,
    };

    const subQuery = (column) => [
      sequelize.literal(`(
      SELECT IFNULL(SUM(${column}), 0)
      FROM tacn.goods_receipt AS goods_receipt
      WHERE
          goods_receipt.supplier_id = Supplier.id AND
          goods_receipt.created_at >= ${from_date} AND
          goods_receipt.created_at <= ${to_date} AND
          goods_receipt.is_active = ${IS_ACTIVE.ACTIVE} AND
          goods_receipt.store_id ${store_id ? `= ${store_id}` : "IS NOT NULL"}
      )`),
      column,
    ];
    // return subQuery;

    return super._findAndCountAll(
      {
        where: { ...options, [Op.or]: [{ code: { [Op.substring]: search } }] },
        attributes: [
          "id",
          "code",
          "name",
          "phone_number",
          subQuery("total_price"),
          subQuery("paid_price"),
          subQuery("debt"),
        ],
        order: [["id", "DESC"]],
        limit,
        offset,
        logging: console.log,
      },
      page,
      "Supplier"
    );
  };

  getListGoodsIssue = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, store_id } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      agent_id: req.user.agent_id,
    };

    return super._findAndCountAll(
      {
        where: { ...options },
        include: [
          {
            model: Order,
            where: {
              is_active: IS_ACTIVE.ACTIVE,
              store_id: store_id || { [Op.ne]: null },
            },
            attributes: [],
            include: [{ model: Store }],
          },
        ],
        attributes: [
          "id",
          [sequelize.literal('product->"$.product_name"'), "product_name"],
          "created_at",
          [sequelize.col("Order.Store.name"), "store_name"],
          [sequelize.col("Order.goods_price"), "goods_price"],
          [sequelize.literal("goods_price - total_price"), "discount"],
          [sequelize.col("Order.total_price"), "total_price"],

          // [sequelize.literal("amount * price"), "total_price"],
          [
            sequelize.literal('amount *  product->"$.import_price"'),
            "import_price",
          ],
          [
            sequelize.literal(
              'amount * price - amount *  product->"$.import_price"'
            ),
            "profit",
          ],
        ],
        order: [["id", "DESC"]],
        limit,
        offset,
      },
      page,
      "OrderProduct"
    );
  };

  getListGoodsReturn = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, store_id } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      sale_type: SALE_TYPE.RETURN,
      store_id: store_id || { [Op.ne]: null },
      agent_id: req.user.agent_id,
    };

    return super._findAndCountAll(
      {
        where: { ...options },
        attributes: [
          [
            sequelize.literal("from_unixtime(created_at, '%d/%m/%Y')"),
            "created_at",
          ],
          [sequelize.fn("COUNT", sequelize.col("id")), "amount_of_return"],
          [sequelize.fn("sum", sequelize.col("total_price")), "total_price"],
        ],
        group: [[sequelize.literal("DATE(created_at)")]],
        order: [["id", "DESC"]],
        limit,
        offset,
      },
      page,
      "Order"
    );
  };

  getListInventory = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, store_id } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      sale_type: SALE_TYPE.RETURN,
      store_id: store_id || { [Op.ne]: null },
      agent_id: req.user.agent_id,
    };

    return super._findAndCountAll(
      {
        where: { ...options },
        attributes: [
          [
            sequelize.literal("from_unixtime(created_at, '%d/%m/%Y')"),
            "created_at",
          ],
          [sequelize.fn("COUNT", sequelize.col("id")), "amount_of_return"],
          [sequelize.fn("sum", sequelize.col("total_price")), "total_price"],
        ],
        group: [[sequelize.literal("DATE(created_at)")]],
        order: [["id", "DESC"]],
        limit,
        offset,
      },
      page,
      "Order"
    );
  };

  getListTransaction = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      type: Joi.number().integer().allow(null, ""),
      object: Joi.number().integer().required(),
      id: Joi.number().integer().required(),
    }).unknown(true);

    const { search, store_id, type, object, id } = await schema.validateAsync(
      req.query
    );

    const { page, limit, offset } = req.query;

    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      type: type || { [Op.ne]: null },
      // agent_id: req.user.agent_id,
    };

    if (object == INVOICE_OBJECT.CUSTOMER) options["customer_id"] = id;

    if (object == INVOICE_OBJECT.SUPPLIER) options["supplier_id"] = id;

    return super._findAndCountAll(
      {
        where: { ...options },
        include: [
          {
            model: Customer,
            where: { is_active: IS_ACTIVE.ACTIVE },
            required: false,
            attributes: [],
          },
          {
            model: Supplier,
            where: { is_active: IS_ACTIVE.ACTIVE },
            required: false,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [sequelize.col("Customer.name"), "customer_name"],
            [sequelize.col("Supplier.name"), "supplier_name"],
          ],
        },
        order: [["id", "desc"]],
        limit,
        offset,
      },
      page,
      "Transaction"
    );
  };

  getListHistory = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      type: Joi.number().integer().allow(null, ""),
      object: Joi.number().integer().required(),
      id: Joi.number().integer().required(),
    }).unknown(true);

    const { search, store_id, type, object, id } = await schema.validateAsync(
      req.query
    );

    const { page, limit, offset } = req.query;

    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    let options = {};
    options = {
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      // agent_id: req.user.agent_id,
      // customer_id: id ?
      //   type == [TRANSACTION_TYPE.RETURN_GOODS] ||
      //   type == [TRANSACTION_TYPE.SALE_GOODS_RETAIL] ||
      //   type == [TRANSACTION_TYPE.SALE_GOODS_WHOLESALE] :
      //   type == [TRANSACTION_TYPE.RECEIVE_GOODS],
    };

    if (object == INVOICE_OBJECT.CUSTOMER) {
      options["customer_id"] = id;
      if (type) {
        options = {
          ...options,
          // [Op.or]: [
          //   { type: TRANSACTION_TYPE.RETURN_GOODS },
          //   { type: TRANSACTION_TYPE.SALE_GOODS_RETAIL },
          //   { type: TRANSACTION_TYPE.SALE_GOODS_WHOLESALE },
          // ],
          type,
        };
      }
      if (!type) {
        options = {
          ...options,
          [Op.or]: [
            { type: TRANSACTION_TYPE.RETURN_GOODS },
            { type: TRANSACTION_TYPE.SALE_GOODS_RETAIL },
            { type: TRANSACTION_TYPE.SALE_GOODS_WHOLESALE },
          ],
        };
      }
    }

    if (object == INVOICE_OBJECT.SUPPLIER) {
      options["supplier_id"] = id;
      if (type) {
        options = {
          ...options,
          type,
        };
      }
      if (!type) {
        options = {
          ...options,
          [Op.or]: [{ type: TRANSACTION_TYPE.RECEIVE_GOODS }],
        };
      }
    }

    return super._findAndCountAll(
      {
        where: { ...options },
        include: [
          {
            model: Customer,
            where: { is_active: IS_ACTIVE.ACTIVE },
            required: false,
            attributes: [],
          },
          {
            model: Supplier,
            where: { is_active: IS_ACTIVE.ACTIVE },
            required: false,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [sequelize.col("Customer.name"), "customer_name"],
            [sequelize.col("Supplier.name"), "supplier_name"],
          ],
        },
        order: [["id", "desc"]],
        limit,
        offset,
      },
      page,
      "Transaction"
    );
  };

  // báo cáo sổ quỹ
  getListFundsbook = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      customer_id: Joi.number().integer().allow(null, ""),
      supplier_id: Joi.number().integer().allow(null, ""),
      store_id: Joi.number().integer().allow(null, ""),
      // invoice_type_id: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const { search, customer_id, store_id, invoice_type_id, supplier_id } =
      await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };
    // return options;

    // if (customer_id) options["id"] = customer_id;
    // if (customer_id) options["id"] = customer_id;

    let totalInvoiceCustomer;
    let totalInvoiceSupplier;
    let totalOrderCustomer;
    let totalOrderSuplier;
    let totalReturnPrice;
    let totalPaymentInvoiceCustomer;
    let totalPaymentInvoiceSupplier;
    await Promise.all([
      // Tổng phiếu thu bao gồm phiếu thu + bán hàng
      (totalInvoiceCustomer = await Invoice.sum("amount", {
        where: {
          ...options,
          customer_id: customer_id || { [Op.ne]: null },
          voucher_type: VOUCHER.RECEIPT,
          // invoice_type_id: invoice_type_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalInvoiceSupplier = await Invoice.sum("amount", {
        where: {
          ...options,
          supplier_id: supplier_id || { [Op.ne]: null },
          voucher_type: VOUCHER.RECEIPT,
          // invoice_type_id: invoice_type_id || { [Op.ne]: null },
        },
        include: [{ model: Supplier, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalOrderCustomer = await Order.sum("paid_price", {
        where: {
          ...options,
          store_id: store_id || { [Op.ne]: null },
          sale_type: { [Op.ne]: SALE_TYPE.RETURN },
          customer_id: customer_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),

      // Tổng chi = trả hàng (customer) + nhập hàng( supplier) + phiếu chi (sup+ cus)
      (totalOrderSuplier = await GoodsReceipt.sum("paid_price", {
        where: {
          ...options,
          store_id: store_id || { [Op.ne]: null },
          supplier_id: supplier_id || { [Op.ne]: null },
        },
        include: [{ model: Supplier, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      // return totalOrderPrice;

      (totalReturnPrice = await Order.sum("paid_price", {
        where: {
          ...options,
          customer_id: customer_id || { [Op.ne]: null },
          sale_type: SALE_TYPE.RETURN,
          store_id: store_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalPaymentInvoiceCustomer = await Invoice.sum("amount", {
        where: {
          ...options,
          customer_id: customer_id || { [Op.ne]: null },
          voucher_type: VOUCHER.PAYMENT,
          // invoice_type_id: invoice_type_id || { [Op.ne]: null },
        },
        include: [{ model: Customer, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
      (totalPaymentInvoiceSupplier = await Invoice.sum("amount", {
        where: {
          ...options,
          supplier_id: supplier_id || { [Op.ne]: null },
          voucher_type: VOUCHER.PAYMENT,
          // invoice_type_id: invoice_type_id || { [Op.ne]: null },
        },
        include: [{ model: Supplier, where: { is_active: IS_ACTIVE.ACTIVE } }],
      })),
    ]);
    // return totalReturnPrice;

    let totalRevenueCustomer: number;
    let totalRevenueSupplier: number;
    let totalExpenditureCustomer: number;
    let totalExpenditureSupplier: number;
    // tổng tiền thu của khách hàng
    totalRevenueCustomer = customer_id
      ? (totalOrderCustomer || 0) +
      (totalInvoiceCustomer || 0)
      : 0;
    // tổng tiền thu của 
    totalRevenueSupplier = supplier_id
      ? (totalOrderCustomer || 0)
      : 0;
    // tổng tiền chi của customer
    totalExpenditureCustomer = customer_id
      ? (totalReturnPrice || 0) +
      (totalPaymentInvoiceCustomer || 0)
      : 0;
    totalExpenditureSupplier = supplier_id
      ? (totalOrderSuplier || 0) +
      (totalPaymentInvoiceSupplier || 0)
      : 0;
    if (!customer_id && !supplier_id) {
      totalRevenueCustomer = (totalOrderCustomer || 0) + (totalInvoiceCustomer || 0);
      // tổng tiền thu của 
      totalRevenueSupplier = (totalOrderCustomer || 0);
      // tổng tiền chi của customer
      totalExpenditureCustomer = (totalReturnPrice || 0) + (totalPaymentInvoiceCustomer || 0);
      totalExpenditureSupplier = (totalOrderSuplier || 0) + (totalPaymentInvoiceSupplier || 0);
    }



    let queryCustomerId;
    let querySupplierId;
    const queryStoreId = store_id ? "=:store_id" : "IS NOT NULL";
    if (customer_id || supplier_id) {
      queryCustomerId = customer_id ? "=:customer_id" : "IS NULL";
      querySupplierId = supplier_id ? "=:supplier_id" : "IS NULL";
    }
    if (!customer_id && !supplier_id) {
      queryCustomerId = customer_id ? "=:customer_id" : "IS NOT NULL";
      querySupplierId = supplier_id ? "=:supplier_id" : "IS NOT NULL";
    }



    const subQuerySupplier = (column) => [
      sequelize.literal(`(
      SELECT IFNULL(SUM(${column}), 0)
      FROM tacn.goods_receipt AS goods_receipt
      WHERE
          goods_receipt.supplier_id = Supplier.id AND
          goods_receipt.created_at >= ${from_date} AND
          goods_receipt.created_at <= ${to_date} AND
          goods_receipt.is_active = ${IS_ACTIVE.ACTIVE} AND
          goods_receipt.store_id ${store_id ? `= ${store_id}` : "IS NOT NULL"}
      )`),
      column,
    ];
    const subQueryCustomer = (sale_type, name_column) =>
      `(SELECT 
      IFNULL(SUM(orders.paid_price), 0)
      FROM
        tacn.order AS orders
      WHERE
        orders.customer_id = Customer.id
            AND orders.is_active = 1
            AND (orders. store_id ${queryStoreId})
            AND (orders.sale_type = ${sale_type})
            AND (orders.created_at >= ${from_date} AND orders.created_at <= ${to_date})
            AND orders.store_id IS NOT NULL) AS ${name_column}`;
    const subQueryInvoice = (voucher_type, name_column, table, id) =>
      `(SELECT 
      IFNULL(SUM(invoice.amount), 0)
      FROM
        tacn.invoice AS invoice
      WHERE
        invoice.${id} = ${table}.id
            AND invoice.is_active = ${IS_ACTIVE.ACTIVE}
            AND (invoice.voucher_type = ${voucher_type})
            AND (invoice.created_at >= ${from_date} AND invoice.created_at <= ${to_date})
            AND invoice.invoice_type_id IS NOT NULL) AS ${name_column}`;
    // return subQueryCustomer(1, "abc");
    const midQuery = `
    SELECT * from 
   (SELECT 
   \`Customer\`.\`id\`,
   \`Customer\`.\`code\`,
   \`Customer\`.\`name\`,
   \`Customer\`.\`phone_number\`,
   0 as order_price,
   ${subQueryCustomer(SALE_TYPE.RETAIL, "retail_price")},
   ${subQueryCustomer(SALE_TYPE.RETURN, "return_price")},
   ${subQueryCustomer(SALE_TYPE.WHOLESALE, "wholesale_price")},
   ${subQueryInvoice(VOUCHER.RECEIPT, "receipt_price", "Customer", "customer_id")},
   ${subQueryInvoice(VOUCHER.PAYMENT, "payment_price", "Customer", "customer_id")}
   FROM 
   \`customer\` AS \`Customer\`
   WHERE 
   (\`Customer\`.\`name\` LIKE '%${search}%'
     OR \`Customer\`.\`phone_number\` LIKE '%${search}%'
   )
   AND (\`Customer\`.\`id\` ${queryCustomerId})
   AND (\`Customer\`.\`created_at\` >= ${from_date} AND \`Customer\`.\`created_at\` <= ${to_date})
   AND \`Customer\`.\`is_active\`= 1
   UNION
   SELECT
   \`Supplier\`.\`id\`,
   \`Supplier\`.\`code\`,
   \`Supplier\`.\`name\`,
   \`Supplier\`.\`phone_number\`,
   0 as retail_price,
   0 as return_price,
   0 as order_price,
   (SELECT
      IFNULL(SUM(\`goods_receipt\`.\`paid_price\`), 0)
      FROM
        \`goods_receipt\` AS goods_receipt
      WHERE
        \`goods_receipt\`.\`supplier_id\` = \`Supplier\`.\`id\`
            AND \`goods_receipt\`.\`is_active\` = 1
            AND (\`goods_receipt\`.\`store_id\` ${queryStoreId})
            AND (\`goods_receipt\`.\`created_at\` >= ${from_date} AND \`goods_receipt\`.\`created_at\` <= ${to_date})
            AND goods_receipt.store_id IS NOT NULL) AS \`order_price\`,
   ${subQueryInvoice(VOUCHER.RECEIPT, "receipt_price", "Supplier", "supplier_id")},
   ${subQueryInvoice(VOUCHER.PAYMENT, "payment_price", "Supplier", "supplier_id")}
   FROM 
   \`supplier\` AS \`Supplier\`
   WHERE 
   (\`Supplier\`.\`name\` LIKE '%${search}%'
     OR \`Supplier\`.\`phone_number\` LIKE '%${search}%'
   )
   AND (\`Supplier\`.\`id\` ${querySupplierId})
   AND (\`Supplier\`.\`created_at\` >= ${from_date} AND \`Supplier\`.\`created_at\` <= ${to_date})
   AND \`Supplier\`.\`is_active\`= 1) as report
   LIMIT :offset,:limit;`;

    //Count

    const query = await sequelize.query(midQuery, {
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        store_id: store_id,
        customer_id,
        supplier_id,
        offset,
        limit,
        page: page,
      },
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    return {
      data: query,
      total_revenue: totalRevenueCustomer + totalRevenueSupplier,
      total_expenditure: totalExpenditureCustomer + totalExpenditureSupplier,
      paging: {
        page,
        totalItemCount: query.length,
        limit,
      },
    };
  };

}
