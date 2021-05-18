import {
  IS_ACTIVE,
  apiCode,
  SALE_TYPE,
  TRANSACTION_TYPE,
} from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";
const { QueryTypes } = require("sequelize");

import transaction from "sequelize/types/lib/transaction";
import { create } from "lodash";

const db = require("@models");
const {
  Unit,
  ProductCategory,
  ProductImage,
  sequelize,
  Sequelize,
  Product,
  User,
  Supplier,
  Store,
  Order,
  ProductReceipt,
  ProductOfStore,
  Customer,
  OrderProduct,
  Transaction,
} = db.default;
const { Op } = Sequelize;

const attributesProduct = {
  include: [
    {
      model: Store,
      attributes: [],
    },
    {
      model: User,
      attributes: [],
    },
    {
      model: Customer,
      attributes: [],
    },
  ],
  attributes: {
    include: [
      //[sequelize.col("products.product"), "order_product"],
      [sequelize.col("Store.name"), "store_name"],
      [sequelize.col("User.name"), "staff_name"],
      [sequelize.col("Customer.name"), "customer_name"],
    ],
  },
};
export class OrderController extends ApplicationController {
  constructor() {
    super("Order");
  }
  create = async (req, res) => {
    const schema = Joi.object()
      .keys({
        note: Joi.string().allow(null, ""),
        first_discount: Joi.number().required(),
        second_discount: Joi.number().required(),
        paid_price: Joi.number().required(),
        // staff_id: Joi.number().integer().allow(null, ""),
        customer_id: Joi.number().integer().required(),
        store_id: Joi.number().integer().required(),
        payment_type: Joi.number().integer().required(),
        sale_type: Joi.number().integer().required(),
        products: Joi.array()
          .items(
            Joi.object()
              .keys({
                code: Joi.string().required(),
                price: Joi.number().integer().required(),
                amount: Joi.number().integer().required(),
              })
              .unknown(true)
          )
          .required(),
      })
      .unknown(true);

    const {
      // staff_id,
      customer_id,
      store_id,
      products,
      first_discount,
      second_discount,
      paid_price,
    } = await schema.validateAsync(req.body);

    // let staff: Object;
    let customer: Object;
    let store: Object;
    let productOfStore = [];
    await Promise.all([
      (customer = await Customer.findOne({
        where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: store_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (productOfStore = await ProductOfStore.findAll({
        raw: true,
        where: {
          product_code: {
            [Op.in]: products.map((product) => product.code),
          },
          store_id,
          is_active: IS_ACTIVE.ACTIVE,
          amount: { [Op.gt]: 0 },
        },
        logging: console.log,
        order: [["expired_at", "DESC"]],
      })),
    ]);
    // return productOfStore;
    if (!customer || !store || productOfStore.length < products.length)
      throw apiCode.NOT_FOUND;

    const goodsPrice = products.reduce(
      (sum, { price, amount }) => (sum += price * amount),
      0
    );

    const firstDiscount = goodsPrice - (goodsPrice * first_discount) / 100;
    const totalPrice = firstDiscount - (firstDiscount * second_discount) / 100;

    const debt = totalPrice - paid_price;
    const data = await sequelize.transaction(async (transaction) => {
      let itemArray = [];
      let productOfOrderProduct = [];
      const amountProduct = products.length;
      for (let index = 0; index < amountProduct; index++) {
        itemArray = productOfStore.filter(
          (product) => product.product_code == products[index].code
        );
        const sumAmount = itemArray.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.amount;
        }, 0);
        // return sumAmount;
        // return itemArray;
        let amountInput = products[index].amount;
        // return amountInput;
        if (amountInput > sumAmount) {
          throw new TypeError(
            `mã ${products[index].code} còn ${sumAmount} sản phẩm. Không đủ`
          );
        }
        let updateAmount: number;
        // let createAmountOrder: number;
        const amountItem = itemArray.length;
        for (let index = 0; index < amountItem; index++) {
          if (amountInput == 0) break;
          if (amountInput >= itemArray[index].amount) {
            amountInput -= itemArray[index].amount;
            updateAmount = 0;
            //  createAmountOrder = itemArray[index].amount;
          } else {
            //  createAmountOrder = amountInput;
            updateAmount = itemArray[index].amount - amountInput;
            amountInput = 0;
          }
          await ProductOfStore.update(
            {
              amount: updateAmount,
            },
            {
              where: {
                code: itemArray[index].code,
              },
              transaction,
            }
          );
        }
        const findProductCode = await ProductOfStore.findOne({
          where: {
            product_code: products[index].code,
          },
        });
        productOfOrderProduct.push(findProductCode);
      }

      const { id } = await super._create(
        {
          ...req.body,
          code: Order.generateCode(),
          goods_price: goodsPrice,
          total_price: totalPrice,
          debt,
          agent_id: req.user.agent_id,
          staff_id: req.user.id,
        },
        { transaction }
      );
      const productOfOrder = products.map((product, index) => ({
        order_id: id,
        ...product,
        product: productOfOrderProduct[index],
        agent_id: req.user.agent_id,
      }));
      let orderProduct: Object;
      let order: Object;
      await Promise.all([
        (orderProduct = await OrderProduct.bulkCreate(productOfOrder, {
          transaction,
        })),
        (order = await Order.findOne({
          where: id,
        })),
        Customer.update(
          { debt: customer["debt"] + debt },
          {
            where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        ),
      ]);
      return id;
    });
    return this.orderId(data);
  };

  updateOrder = async (req, res) => {
    const schema = Joi.object()
      .keys({
        order_id: Joi.number().integer().required(),
        note: Joi.string().allow(null, ""),
        first_discount: Joi.number().required(),
        second_discount: Joi.number().required(),
        paid_price: Joi.number().required(),
        // staff_id: Joi.number().integer().allow(null, ""),
        customer_id: Joi.number().integer().required(),
        store_id: Joi.number().integer().required(),
        payment_type: Joi.number().integer().required(),
        sale_type: Joi.number().integer().required(),
        products: Joi.array()
          .items(
            Joi.object()
              .keys({
                code: Joi.string().required(),
                price: Joi.number().integer().required(),
                amount: Joi.number().integer().required(),
              })
              .unknown(true)
          )
          .required(),
      })
      .unknown(true);

    const {
      order_id,
      // staff_id,
      customer_id,
      store_id,
      products,
      first_discount,
      second_discount,
      paid_price,
      sale_type,
    } = await schema.validateAsync(req.body);

    // let staff: Object;
    let customer: Object;
    let orderDetail: Object;
    let store: Object;
    let productOfStore = [];
    await Promise.all([
      (orderDetail = await Order.findOne({
        where: { id: order_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: orderDetail["customer_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: orderDetail["store_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (productOfStore = await ProductOfStore.findAll({
        raw: true,
        where: {
          product_code: {
            [Op.in]: products.map((product) => product.code),
          },
          store_id,
          is_active: IS_ACTIVE.ACTIVE,
          // amount: { [Op.gt]: 0 },
        },
        logging: console.log,
        order: [["expired_at", "DESC"]],
      })),
    ]);
    // return { orderDetail, customer, store };
    // return productOfStore;
    if (
      !orderDetail ||
      !customer ||
      !store ||
      productOfStore.length < products.length
    )
      throw apiCode.NOT_FOUND;
    const findOrderProduct = await OrderProduct.findAll({
      where: { order_id: order_id },
    });
    // return findOrderProduct;
    // const findStoreGoodsReceipt = await GoodsReceipt.findOne({
    //   where: { id: goods_receipt_id, is_active: IS_ACTIVE.ACTIVE },
    // });
    // if (!findStoreGoodsReceipt) {
    //   throw apiCode.DATA_NOT_EXIST;
    // }
    let debt_customer: number;
    debt_customer =
      customer["debt"] - orderDetail["total_price"] + orderDetail["paid_price"];
    // return debt_customer;
    const lengthArr = findOrderProduct.length;
    const debt_supplier_transaction = customer ? customer["debt"] : 0;
    // return findOrderProduct[0];
    // return debt_supplier_transaction;
    const data = await sequelize.transaction(async (transaction) => {
      // update lại số lượng trong kho
      for (let index = 0; index < lengthArr; index++) {
        // return findOrderProduct[index];
        // return findOrderProduct[index].dataValues.product.code;
        let itemArray: Object;
        itemArray = await ProductOfStore.findOne({
          where: {
            product_code:
              findOrderProduct[index].dataValues.product.product_code,
            is_active: IS_ACTIVE.ACTIVE,
          },
        });
        // const sumAmount = itemArray.reduce((accumulator, currentValue) => {
        //   console.log(accumulator, currentValue);
        //   return accumulator + currentValue.amount;
        // }, 0);
        // số lượng sau khi xóa phiếu bán hàng
        const sumAmount: number =
          itemArray["amount"] + findOrderProduct[index].amount;
        // return sumAmount;
        await ProductOfStore.update(
          {
            amount: sumAmount,
          },
          {
            where: {
              product_code:
                findOrderProduct[index].dataValues.product.product_code,
            },
          }
        );
      }
      // update trạng thái phiếu
      const updateOrder = await super._update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: order_id },
          transaction,
        }
      );
      await Customer.update(
        {
          debt: debt_customer,
        },
        {
          where: { id: customer["id"], is_active: IS_ACTIVE.ACTIVE },
          transaction,
        }
      );
      await OrderProduct.update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: {
            order_id,
          },
          transaction,
        }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Xoá phiếu bán hàng " + Order.generateCode(),
          amount: -orderDetail["total_price"],
          debt: debt_supplier_transaction - orderDetail["total_price"],
          type:
            customer["sale_type"] === SALE_TYPE.WHOLESALE
              ? TRANSACTION_TYPE.DELETE_SALE_GOODS_WHOLESALE
              : TRANSACTION_TYPE.DELETE_SALE_GOODS_RETAIL,
        },
        { transaction }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Hoàn trả tiền cho khách hàng " + Order.generateCode(),
          amount: orderDetail["paid_price"],
          debt:
            debt_supplier_transaction -
            orderDetail["total_price"] +
            orderDetail["paid_price"],
          // type: TRANSACTION_TYPE.RETURN_MONEY_ORDER,
          type: TRANSACTION_TYPE.DELETE_SALE_GOODS_RETAIL,
        },
        { transaction }
      );
    });
    const updateOrder = this.create(req, res);
    return updateOrder;
  };

  // xóa order

  deleteOrder = async (req, res) => {
    const schema = Joi.object()
      .keys({
        order_id: Joi.number().integer().required(),
      })
      .unknown(true);
    const { order_id } = await schema.validateAsync(req.body);

    // let staff: Object;
    let customer: Object;
    let orderDetail: Object;
    let store: Object;
    let productOfStore = [];
    await Promise.all([
      (orderDetail = await Order.findOne({
        where: { id: order_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: orderDetail["customer_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: orderDetail["store_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);
    // return { orderDetail, customer, store };
    if (!orderDetail || !customer || !store) throw apiCode.NOT_FOUND;
    const findOrderProduct = await OrderProduct.findAll({
      where: { order_id: order_id },
    });
    let debt_customer: number;
    debt_customer =
      customer["debt"] - orderDetail["total_price"] + orderDetail["paid_price"];
    const lengthArr = findOrderProduct.length;
    const debt_supplier_transaction = customer ? customer["debt"] : 0;
    const data = await sequelize.transaction(async (transaction) => {
      // update lại số lượng trong kho
      for (let index = 0; index < lengthArr; index++) {
        // return findOrderProduct[index];
        let itemArray: Object;
        itemArray = await ProductOfStore.findOne({
          where: {
            product_code:
              findOrderProduct[index].dataValues.product.product_code,
            is_active: IS_ACTIVE.ACTIVE,
          },
        });
        // return itemArray;
        // số lượng sau khi xóa phiếu bán hàng
        const sumAmount: number =
          itemArray["amount"] + findOrderProduct[index].amount;
        // return sumAmount;
        await ProductOfStore.update(
          {
            amount: sumAmount,
          },
          {
            where: {
              product_code:
                findOrderProduct[index].dataValues.product.product_code,
            },
          }
        );
      }
      // update trạng thái phiếu
      const updateOrder = await super._update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: order_id },
          transaction,
        }
      );
      await Customer.update(
        {
          debt: debt_customer,
        },
        {
          where: { id: customer["id"], is_active: IS_ACTIVE.ACTIVE },
          transaction,
        }
      );
      await OrderProduct.update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: {
            order_id,
          },
          transaction,
        }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Xoá phiếu bán hàng " + Order.generateCode(),
          amount: -orderDetail["total_price"],
          debt: debt_supplier_transaction - orderDetail["total_price"],
          type:
            customer["sale_type"] === SALE_TYPE.WHOLESALE
              ? TRANSACTION_TYPE.DELETE_SALE_GOODS_WHOLESALE
              : TRANSACTION_TYPE.DELETE_SALE_GOODS_RETAIL,
        },
        { transaction }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Hoàn trả tiền cho khách hàng " + Order.generateCode(),
          amount: orderDetail["paid_price"],
          debt:
            debt_supplier_transaction -
            orderDetail["total_price"] +
            orderDetail["paid_price"],
          type:
            customer["sale_type"] === SALE_TYPE.WHOLESALE
              ? TRANSACTION_TYPE.DELETE_SALE_GOODS_WHOLESALE
              : TRANSACTION_TYPE.DELETE_SALE_GOODS_RETAIL,
        },
        { transaction }
      );
    });
    return data;
  };

  getListOrder = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
        store_id: Joi.number().integer().allow(null, ""),
        sale_type: Joi.number().integer().allow(null, ""),
        staff_id: Joi.number().integer().allow(null, ""),
      })
      .unknown(true);
    const {
      search,
      store_id,
      sale_type,
      staff_id,
    } = await schema.validateAsync(req.query);
    // return req.query;
    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.or]: [{ code: { [Op.substring]: search } }],
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };

    if (store_id) options["store_id"] = store_id;
    if (sale_type) options["sale_type"] = sale_type;
    if (staff_id) options["staff_id"] = staff_id;
    // return options;
    return super._findAndCountAll(
      {
        where: options,
        ...attributesProduct,
        order: [["id", "DESC"]],
        limit,
        offset,
        logging: console.log,
      },
      page
    );
  };
  getOrderDetail = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().required(),
      })
      .unknown(true);

    const { id } = await schema.validateAsync(req.params);

    return this.findOne(id);
  };

  findOne = async (id: number) =>
    super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      include: [
        ...attributesProduct["include"],
        {
          model: OrderProduct,
          as: "products",
          where: { is_active: IS_ACTIVE.ACTIVE },
        },
      ],
      logging: console.log,
    });
  orderId = async (id: number) => {
    return super._findOne({
      where: { id: id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesProduct,
      logging: console.log,
    });
  };
}
