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
import { Order } from "sequelize/types";

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
  GoodsReturn,
  ProductReturn,
  ProductOfStore,
  Customer,
  OrderProduct,
  Transaction,
  Order,
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
      [sequelize.col("Store.name"), "store_name"],
      [sequelize.col("User.name"), "staff_name"],
      [sequelize.col("Customer.name"), "customer_name"],
    ],
  },
};
export class GoodsReturnController extends ApplicationController {
  constructor() {
    super("Order");
  }
  returnGoods = async (req, res) => {
    const schema = Joi.object()
      .keys({
        note: Joi.string().allow(null, ""),
        first_discount: Joi.number().required(),
        second_discount: Joi.number().required(),
        // staff_id: Joi.number().integer().required(),
        customer_id: Joi.number().integer().required(),
        store_id: Joi.number().integer().required(),
        paid_price: Joi.number().required(),
        products: Joi.array()
          .items(
            Joi.object()
              .keys({
                id: Joi.number().integer().required(),
                code: Joi.string().required(),
                price: Joi.number().integer().required(),
                amount: Joi.number().integer().required(),
                // discount: Joi.number().integer().required(),
                expired_at: Joi.number().integer().allow(null).required(),
              })
              .unknown(true)
          )
          .required(),
      })
      .unknown(true);

    const {
      customer_id,
      store_id,
      products,
      paid_price,
      first_discount,
      second_discount,
    } = await schema.validateAsync(req.body);
    let staff: Object;
    let customer: Object;
    let store: Object;
    let productReturnDetail = [];
    let productReturns = [];

    await Promise.all([
      // (staff = await User.findOne({
      //   where: { id: staff_id, is_active: IS_ACTIVE.ACTIVE },
      // })),
      (customer = await Customer.findOne({
        where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: store_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      // (productReturnDetail = await ProductOfStore.findAll({
      //   raw: true,
      //   where: {
      //     product_code: { [Op.in]: products.map(({ code }) => code) },
      //     is_active: IS_ACTIVE.ACTIVE,
      //     store_id: store_id
      //   },
      // })),
      (productReturnDetail = await Product.findAll({
        raw: true,
        where: {
          code: { [Op.in]: products.map(({ code }) => code) },
          is_active: IS_ACTIVE.ACTIVE,
        },
        include: [
          { model: Unit, attributes: [] },
          { model: ProductCategory, attributes: [] },
        ],
        attributes: {
          include: [
            [sequelize.col("Unit.name"), "unit_name"],
            [sequelize.col("ProductCategory.name"), "product_category_name"],
          ],
        },
        logging: console.log,
      })),
    ]);
    // return productReturnDetail;
    if (
      // !staff ||
      !customer ||
      !store ||
      productReturnDetail.length < products.length
    )
      throw apiCode.NOT_FOUND;

    const softProduct = products.sort(
      (a, b) => parseFloat(a.id) - parseFloat(b.id)
    );
    // return softProduct;

    const goodsPrice = softProduct.reduce(
      (sum, { price, amount }) => (sum += (price - 0) * amount),
      0
    );

    // return goodsPrice;
    const firstDiscount = goodsPrice - (goodsPrice * first_discount) / 100;
    const totalPrice = firstDiscount - (firstDiscount * second_discount) / 100;
    // return { totalPrice, goodsPrice, paid_price };
    // return customer["debt"]-totalPrice+paid_price;
    const goodsReturnId = await sequelize.transaction(async (transaction) => {
      const { id } = await super._create(
        {
          ...req.body,
          code: GoodsReturn.generateCode(),
          goods_price: goodsPrice,
          total_price: totalPrice,
          paid_price: paid_price,
          sale_type: SALE_TYPE.RETURN,
          debt: 0,
          agent_id: req.user.agent_id,
          staff_id: req.user.agent_id,
        },
        { transaction }
      );

      productReturns = productReturnDetail.map((product, index) => ({
        ...product,
        modified_at: Date.now() / 1000,
        amount: softProduct[index].amount,
        // amount: products[index].amount,
        agent_id: req.user.agent_id,
      }));
      const productOfOrder = softProduct.map((product, index) => ({
        order_id: id,
        amount: softProduct[index].amount,
        price: product.price,
        product: productReturns[index],
        agent_id: req.user.agent_id,
        modified_at: Date.now() / 1000,
        expired_at: product.expired_at,
      }));

      const productOfStoreArrayLength = softProduct.length;
      for (let index = 0; index < productOfStoreArrayLength; index++) {
        if (!softProduct[index].expired_at) {
          softProduct[index].expired_at = -1;
        }
      }
      const productOfStore = productReturnDetail.map((product, index) => ({
        code: ProductOfStore.generateCode(),
        modified_at: Date.now() / 1000,
        product_code: product.code,
        product_name: product.name,
        product_unit: product.unit_name,
        product_category: product.product_category_name,
        store_id,
        amount: softProduct[index].amount,
        import_price: product.import_price,
        created_at: Date.now() / 1000,
        is_active: IS_ACTIVE.ACTIVE,
        agent_id: req.user.agent_id,
        expired_at: softProduct[index].expired_at,
      }));

      const query = `
      INSERT INTO \`product_of_store\`
      (\`code\`,\`modified_at\`,\`product_code\`,\`product_name\`,\`product_unit\`,\`product_category\`,\`store_id\`,\`amount\`,\`import_price\`,\`created_at\`,\`is_active\`,\`agent_id\`,
      \`expired_at\`)
      VALUES ${productOfStore
        .map((product) => `('${Object.values(product).join("','")}')`)
        .toString()}
      ON DUPLICATE KEY UPDATE
      \`product_code\`=VALUES(\`product_code\`),
      \`product_name\`=VALUES(\`product_name\`),
      \`product_unit\`=VALUES(\`product_unit\`),
      \`product_category\`=VALUES(\`product_category\`),
      \`store_id\`=VALUES(\`store_id\`),
      \`import_price\`=VALUES(\`import_price\`),
      \`expired_at\`= VALUES(\`expired_at\`),
      \`amount\`=\`amount\`+ VALUES(\`amount\`);
      `;
      let orderProduct: Object;
      await Promise.all([
        (orderProduct = await OrderProduct.bulkCreate(productOfOrder, {
          transaction,
        })),
        Customer.update(
          { debt: customer["debt"] - totalPrice + paid_price },
          {
            where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        ),
      ]);

      return id;
    });

    return this.findOne(goodsReturnId);
  };

  updateGoodsReturn = async (req, res) => {
    const schema = Joi.object()
      .keys({
        goods_return_id: Joi.number().integer().required(),
        note: Joi.string().allow(null, ""),
        first_discount: Joi.number().required(),
        second_discount: Joi.number().required(),
        // staff_id: Joi.number().integer().required(),
        customer_id: Joi.number().integer().required(),
        store_id: Joi.number().integer().required(),
        paid_price: Joi.number().required(),
        products: Joi.array()
          .items(
            Joi.object()
              .keys({
                id: Joi.number().integer().required(),
                code: Joi.string().required(),
                price: Joi.number().integer().required(),
                amount: Joi.number().integer().required(),
                expired_at: Joi.number().integer().allow(null).required(),
              })
              .unknown(true)
          )
          .required(),
      })
      .unknown(true);
    const {
      goods_return_id,
      // staff_id,
      customer_id,
      store_id,
      products,
      first_discount,
      second_discount,
      paid_price,
    } = await schema.validateAsync(req.body);
    let staff: Object;
    let goodsReturns: Object;
    let customer: Object;
    let store: Object;
    let productOfStore = [];

    await Promise.all([
      (goodsReturns = await Order.findOne({
        where: { id: goods_return_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (staff = await User.findOne({
        where: { id: goodsReturns["staff_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: goodsReturns["customer_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: goodsReturns["store_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      // (productOfStore = await ProductOfStore.findAll({
      //   raw: true,
      //   where: {
      //     product_code: { [Op.in]: products.map(({ code }) => code) },
      //     is_active: IS_ACTIVE.ACTIVE,
      //     store_id: store_id,
      //   },
      // })),
      (productOfStore = await Product.findAll({
        raw: true,
        where: {
          code: { [Op.in]: products.map(({ code }) => code) },
          is_active: IS_ACTIVE.ACTIVE,
        },
        include: [
          { model: Unit, attributes: [] },
          { model: ProductCategory, attributes: [] },
        ],
        attributes: {
          include: [
            [sequelize.col("Unit.name"), "unit_name"],
            [sequelize.col("ProductCategory.name"), "product_category_name"],
          ],
        },
        logging: console.log,
      })),
    ]);

    // return 1;
    // const returnGoods = await GoodsReturn.findOne({
    //     where: { id: goods_return_id, is_active: IS_ACTIVE.ACTIVE },
    // });

    if (
      !goodsReturns ||
      !staff ||
      !customer ||
      !store ||
      productOfStore.length < products.length
    )
      throw apiCode.NOT_FOUND;

    const findProductReturn = await OrderProduct.findAll({
      where: { order_id: goods_return_id },
    });
    const findStoreGoodsReturn = await Order.findOne({
      where: { id: goods_return_id, is_active: IS_ACTIVE.ACTIVE },
    });
    // return findProductReturn[0].product.product_code;
    let debt_customer: number;
    debt_customer =
      customer["debt"] +
      goodsReturns["total_price"] -
      goodsReturns["paid_price"];
    const lengthArr = findProductReturn.length;
    const debt_customer_transaction = customer ? customer["debt"] : 0;

    // return debt_customer_transaction;
    await sequelize.transaction(async (transaction) => {
      for (let index = 0; index < lengthArr; index++) {
        // const sortArrayProducts = findProductReceipt[
        //   index
        // ].dataValues.products.sort(function (a: any, b: any) {
        //   return a.id - b.id;
        // });

        if (!findProductReturn[index].expired_at) {
          findProductReturn[index].expired_at = -1;
        }
        // return findProductReturn[0].product.store_id;
        const attributesProductOfStore = {
          product_code: findProductReturn[index].product.code,
          product_name: findProductReturn[index].product.name,
          product_unit: findProductReturn[index].product.unit_name,
          product_category:
            findProductReturn[index].product.product_category_name,
          store_id: findStoreGoodsReturn.store_id,
          import_price: findProductReturn[index].product.import_price,
          expired_at: findProductReturn[index].expired_at,
        };
        // const attributesProductOfStore = {
        //   product_code: findProductReturn[index].product.product_code,
        //   product_name: findProductReturn[index].product.product_name,
        //   product_unit: findProductReturn[index].product.product_unit,
        //   product_category: findProductReturn[index].product.product_category,
        //   store_id: findProductReturn[index].product.store_id,
        //   import_price: findProductReturn[index].product.import_price,
        //   expired_at: findProductReturn[index].expired_at,
        // };
        // return attributesProductOfStore;
        const amountCurrentProductOfStore = await ProductOfStore.findOne({
          where: attributesProductOfStore,
        });
        const amountCurrent = amountCurrentProductOfStore.amount;
        // return amountCurrent;
        await ProductOfStore.update(
          {
            amount: amountCurrent - findProductReturn[index].amount,
          },
          { where: attributesProductOfStore }
        );
      }

      // update lại số lượng trong kho
      // for (let index = 0; index < lengthArr; index++) {
      //   // return findOrderProduct[index];
      //   // return findOrderProduct[index].dataValues.product.code;
      //   let itemArray: Object;
      //   itemArray = await ProductOfStore.findOne({
      //     where: {
      //       code: findGoodReturn[index].dataValues.product.code,
      //       is_active: IS_ACTIVE.ACTIVE,
      //     },
      //   });
      //   // số lượng sau khi xóa phiếu bán hàng
      //   const sumAmount: number = itemArray
      //     ? findGoodReturn[index].dataValues.product.amount -
      //       itemArray["amount"]
      //     : findGoodReturn[index].dataValues.product.amount;
      //   await ProductOfStore.update(
      //     {
      //       amount: sumAmount,
      //     },
      //     {
      //       where: {
      //         code: findGoodReturn[index].dataValues.product.code,
      //       },
      //       transaction,
      //     }
      //   );
      // }
      // update trạng thái phiếu
      const updateOrder = await super._update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: goods_return_id },
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
            order_id: goods_return_id,
          },
          transaction,
        }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Xoá phiếu trả hàng " + GoodsReturn.generateCode(),
          amount: goodsReturns["total_price"],
          debt: debt_customer_transaction + goodsReturns["total_price"],
          type: TRANSACTION_TYPE.DELETE_RETURN_GOODS,
        },
        { transaction }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Hoàn trả tiền cho khách hàng " + GoodsReturn.generateCode(),
          amount: -goodsReturns["paid_price"],
          debt: debt_customer,
          // type: TRANSACTION_TYPE.RETURN_MONEY_RETURN,
          type: TRANSACTION_TYPE.DELETE_RETURN_GOODS,
        },
        { transaction }
      );
    });
    const updateReturnGood = this.returnGoods(req, res);
    return updateReturnGood;
  };

  deleteGoodsReturn = async (req, res) => {
    const schema = Joi.object()
      .keys({
        goods_return_id: Joi.number().integer().required(),
      })
      .unknown(true);
    const { goods_return_id } = await schema.validateAsync(req.body);

    let staff: Object;
    let goodsReturns: Object;
    let customer: Object;
    let store: Object;
    let productOfStore = [];

    await Promise.all([
      (goodsReturns = await Order.findOne({
        where: { id: goods_return_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (staff = await User.findOne({
        where: { id: goodsReturns["staff_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: goodsReturns["customer_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: goodsReturns["store_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);
    // const returnGoods = await GoodsReturn.findOne({
    //     where: { id: goods_return_id, is_active: IS_ACTIVE.ACTIVE },
    // });
    // return { returnGoods, store, staff, customer, productOfStore };

    if (!goodsReturns || !staff || !customer || !store) throw apiCode.NOT_FOUND;

    const findProductReturn = await OrderProduct.findAll({
      where: { order_id: goods_return_id },
    });
    let debt_customer: number;
    debt_customer =
      customer["debt"] +
      goodsReturns["total_price"] -
      goodsReturns["paid_price"];
    // return debt_customer;
    const lengthArr = findProductReturn.length;
    const debt_customer_transaction = customer ? customer["debt"] : 0;
    const findStoreGoodsReturn = await Order.findOne({
      where: { id: goods_return_id, is_active: IS_ACTIVE.ACTIVE },
    });
    // return debt_customer_transaction;
    const data = await sequelize.transaction(async (transaction) => {
      // update lại số lượng trong kho
      for (let index = 0; index < lengthArr; index++) {
        // const sortArrayProducts = findProductReceipt[
        //   index
        // ].dataValues.products.sort(function (a: any, b: any) {
        //   return a.id - b.id;
        // });

        if (!findProductReturn[index].expired_at) {
          findProductReturn[index].expired_at = -1;
        }
        // return findProductReturn[0].product.store_id;
        const attributesProductOfStore = {
          product_code: findProductReturn[index].product.code,
          product_name: findProductReturn[index].product.name,
          product_unit: findProductReturn[index].product.unit_name,
          product_category:
            findProductReturn[index].product.product_category_name,
          store_id: findStoreGoodsReturn.store_id,
          import_price: findProductReturn[index].product.import_price,
          expired_at: findProductReturn[index].expired_at,
        };
        // return attributesProductOfStore;
        const amountCurrentProductOfStore = await ProductOfStore.findOne({
          where: attributesProductOfStore,
        });
        const amountCurrent = amountCurrentProductOfStore.amount;
        // return amountCurrent;
        await ProductOfStore.update(
          {
            amount: amountCurrent - findProductReturn[index].amount,
          },
          { where: attributesProductOfStore }
        );
      }
      // update trạng thái phiếu
      await super._update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: goods_return_id },
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
            order_id: goods_return_id,
          },
          transaction,
        }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Xoá phiếu trả hàng " + GoodsReturn.generateCode(),
          amount: goodsReturns["total_price"],
          debt: debt_customer_transaction + goodsReturns["total_price"],
          type: TRANSACTION_TYPE.DELETE_RETURN_GOODS,
        },
        { transaction }
      );
      await Transaction.create(
        {
          customer_id: customer["id"],
          note: "Hoàn trả tiền cho khách hàng " + GoodsReturn.generateCode(),
          amount: -goodsReturns["paid_price"],
          debt: debt_customer,
          type: TRANSACTION_TYPE.DELETE_RETURN_GOODS,
        },
        { transaction }
      );
    });
    return data;
  };

  getListProductReturn = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        // product_category: Joi.string().allow(null, ""),
        store_id: Joi.number().integer().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
      })
      .unknown(true);
    const { search, store_id } = await schema.validateAsync(req.query);
    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }

    let agent_id = req.user.agent_id;
    if (agent_id == null) {
      agent_id = req.user.id;
    }

    const option = {
      // [Op.or]: [
      //   { product_code: { [Op.substring]: search } },
      //   { product_name: { [Op.substring]: search } },
      //   // { product_category: { [Op.substring]: product_category } },
      // ],
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      store_id: store_id || { [Op.ne]: null },
      // amount: { [Op.gt]: 0 },
      agent_id: agent_id,
      sale_type: SALE_TYPE.RETURN,
    };

    return super._findAll(
      {
        where: option,
        include: [
          {
            model: OrderProduct,
            as: "products",
          },
          ...attributesProduct["include"],
        ],
        attributes: {
          include: [
            [sequelize.col("Store.name"), "store_name"],
            [sequelize.col("User.name"), "staff_name"],
            [sequelize.col("Customer.name"), "customer_name"],
          ],
        },
        // limit,
        subQuery: false,
        order: [["id", "DESC"]],
        limit,
        offset,
        logging: console.log,
      },
      page
      // "ProductReceipt"
    );
  };

  findOne = async (id: number) =>
    super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesProduct,
      include: [
        ...attributesProduct["include"],
        {
          model: OrderProduct,
          as: "products",
          where: { is_active: IS_ACTIVE.ACTIVE },
        },
      ],
    });
}
