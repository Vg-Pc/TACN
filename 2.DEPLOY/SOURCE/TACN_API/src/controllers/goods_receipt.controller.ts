import {
  IS_ACTIVE,
  apiCode,
  USER_STATUS,
  TRANSACTION_TYPE,
  CONFIG,
} from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";
const { QueryTypes } = require("sequelize");

import transaction from "sequelize/types/lib/transaction";

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
  GoodsReceipt,
  ProductReceipt,
  ProductOfStore,
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
      model: Supplier,
      attributes: [],
    },
  ],
  attributes: {
    include: [
      [sequelize.col("Store.name"), "store_name"],
      [sequelize.col("User.name"), "staff_name"],
      [sequelize.col("Supplier.name"), "supplier_name"],
    ],
  },
};
export class GoodsReceiptController extends ApplicationController {
  constructor() {
    super("GoodsReceipt");
  }
  receiveGoods = async (req, res) => {
    const schema = Joi.object()
      .keys({
        note: Joi.string().allow(null, ""),
        // first_discount: Joi.number().required(),
        // second_discount: Joi.number().required(),
        // goods_price: Joi.number().required(),
        // total_price: Joi.number().required(),
        paid_price: Joi.number().required(),
        // debt: Joi.number().required(),
        // staff_id: Joi.number().integer().required(),
        supplier_id: Joi.number().integer().required(),
        store_id: Joi.number().integer().required(),
        payment_type: Joi.number().integer().required(),
        // expired_at: Joi.number().integer().required(),
        products: Joi.array()
          .items(
            Joi.object()
              .keys({
                id: Joi.number().integer().required(),
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
      // staff_id,
      supplier_id,
      store_id,
      products,
      // first_discount,
      // second_discount,
      paid_price,
    } = await schema.validateAsync(req.body);

    // let staff: Object;
    let supplier: Object;
    let store: Object;
    let productsReceived = [];
    let agent_id = req.user.agent_id;
    if (agent_id == null) {
      agent_id = req.user.id;
    }
    // return products;

    await Promise.all([
      // (staff = await User.findOne({
      //   where: { id: staff_id, is_active: IS_ACTIVE.ACTIVE },
      // })),
      (supplier = await Supplier.findOne({
        where: { id: supplier_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (store = await Store.findOne({
        where: { id: store_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (productsReceived = await Product.findAll({
        raw: true,
        where: {
          id: { [Op.in]: products.map(({ id }) => id) },
          is_active: IS_ACTIVE.ACTIVE,
          agent_id: agent_id,
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

    // return productsReceived;

    if (!supplier || !store || productsReceived.length < products.length)
      throw apiCode.NOT_FOUND;

    // const goodsPrice = products.reduce(
    //   (sum, { price, amount }) => (sum += price * amount),
    //   0
    // );

    const softProduct = products.sort(
      (a, b) => parseFloat(a.id) - parseFloat(b.id)
    );

    const goodsPrice = softProduct.reduce(
      (sum, { price, amount }) => (sum += price * amount),
      0
    );

    // return goodsPrice;

    const totalPrice = goodsPrice;
    // goodsPrice - (goodsPrice * first_discount * second_discount) / 10000;

    const debt = totalPrice - paid_price;
    // return debt;

    const goodsReceiptId = await sequelize.transaction(async (transaction) => {
      const { id } = await super._create(
        {
          ...req.body,
          code: GoodsReceipt.generateCode(),
          goods_price: goodsPrice,
          total_price: totalPrice,
          debt,
          // modified_at: Date.now() / 1000,
          staff_id: req.user.agent_id,
          agent_id: req.user.agent_id,
        },
        { transaction }
      );
      await GoodsReceipt.update(
        {
          code: GoodsReceipt.generateUpdateCode(id),
        },
        { transaction, where: { id: id } }
      );
      const productReceipt = softProduct.map((product, index) => ({
        price: product.price,
        amount: product.amount,
        //  discount: product.discount,
        goods_receipt_id: id,
        // store_id,
        product: productsReceived[index],
        agent_id: req.user.agent_id,
        modified_at: Date.now() / 1000,
        expired_at: product.expired_at,
      }));
      // return productReceipt;
      const productOfStoreArrayLength = softProduct.length;
      for (let index = 0; index < productOfStoreArrayLength; index++) {
        if (!softProduct[index].expired_at) {
          softProduct[index].expired_at = -1;
        }
      }
      const productOfStore = productsReceived.map((product, index) => ({
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

      const updateLastImportPriceProuduct = softProduct.map((product) => ({
        last_import_price: product.price,
        modified_at: Date.now() / 1000,
      }));
      const whereUpdateId = softProduct.map((product) => ({
        where: { id: product.id },
        transaction,
      }));
      const lengthArray = updateLastImportPriceProuduct.length;
      for (let i = 0; i < lengthArray; i++) {
        await Product.update(
          updateLastImportPriceProuduct[i],
          whereUpdateId[i]
        );
      }
      //  return { updateLastImportPriceProuduct, whereUpdateId };

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

      await Promise.all([
        ProductReceipt.bulkCreate(productReceipt, { transaction }),
        sequelize.query(query, {
          type: QueryTypes.INSERT,
          transaction,
        }),
        Supplier.update(
          { debt: supplier["debt"] - debt },
          {
            where: { id: supplier_id, is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        ),

        // ProductOfStore.bulkCreate(productOfStore, {
        //   transaction,
        //   updateOnDuplicate: [
        //     "product_code",
        //     "product_name",
        //     "product_unit",
        //     "product_category",
        //     "store_id",
        //     "import_price",
        //     sequelize.literal("amount = `amount` + VALUES(`amount`)"),
        //   ],
        //   logging: console.log,
        // }),
      ]);

      return id;
    });

    return this.findOne(goodsReceiptId);
  };

  updateReceiptGoods = async (req, res) => {
    const schema = Joi.object()
      .keys({
        goods_receipt_id: Joi.number().integer().required(),
        note: Joi.string().allow(null, ""),
        supplier_id: Joi.number().integer().required(),
        payment_type: Joi.number().integer().required(),
        paid_price: Joi.number().required(),
        products: Joi.array()
          .items(
            Joi.object()
              .keys({
                id: Joi.number().integer().required(),
                price: Joi.number().required(),
                amount: Joi.number().integer().required(),
                expired_at: Joi.number().integer().allow(null).required(),
              })
              .unknown(true)
          )
          .required(),
      })
      .unknown(true);
    const {
      note,
      payment_type,
      goods_receipt_id,
      supplier_id,
      products,
      paid_price,
    } = await schema.validateAsync(req.body);
    let supplier: Object;
    let goodsReceipt: Object;
    let productsReceived = [];
    let agent_id = req.user.agent_id;
    if (agent_id == null) {
      agent_id = req.user.id;
    }
    await Promise.all([
      (goodsReceipt = await GoodsReceipt.findOne({
        where: { id: goods_receipt_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (supplier = await Supplier.findOne({
        where: {
          id: goodsReceipt["supplier_id"],
          is_active: IS_ACTIVE.ACTIVE,
        },
      })),
      (productsReceived = await Product.findAll({
        where: {
          id: { [Op.in]: products.map(({ id }) => id) },
          is_active: IS_ACTIVE.ACTIVE,
          agent_id: agent_id,
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
    // return {supplier,productsReceived, goodsReceipt};
    if (!supplier || productsReceived.length < products.length) {
      throw apiCode.NOT_FOUND;
    }
    const findProductReceipt = await ProductReceipt.findAll({
      where: { goods_receipt_id: goods_receipt_id },
    });
    // const sortArrayProducts = findProductReceipt.dataValues.products.sort(
    //   function (a: any, b: any) {
    //     return a.id - b.id;
    //   }
    // );
    // sortArrayProducts;
    // return sortArrayProducts;
    const findStoreGoodsReceipt = await GoodsReceipt.findOne({
      where: { id: goods_receipt_id, is_active: IS_ACTIVE.ACTIVE },
    });
    if (!findStoreGoodsReceipt) {
      throw apiCode.DATA_NOT_EXIST;
    }
    let debt_supplier: number;
    debt_supplier =
      supplier["debt"] +
      (findStoreGoodsReceipt.dataValues.total_price -
        findStoreGoodsReceipt.dataValues.paid_price);
    const lengthArr = findProductReceipt.length;
    const debt_supplier_transaction = supplier ? supplier["debt"] : 0;
    // return {debt_supplier, debt_supplier_transaction};
    await sequelize.transaction(async (transaction) => {
      const updateGoodsReceipt = await super._update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: goods_receipt_id },
          transaction,
        }
      );
      await Supplier.update(
        {
          debt: debt_supplier,
        },
        {
          where: { id: supplier["id"], is_active: IS_ACTIVE.ACTIVE },
          transaction,
        }
      );
      await ProductReceipt.update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: {
            goods_receipt_id: goods_receipt_id,
          },
          transaction,
        }
      );
      for (let index = 0; index < lengthArr; index++) {
        // const sortArrayProducts = findProductReceipt[
        //   index
        // ].dataValues.products.sort(function (a: any, b: any) {
        //   return a.id - b.id;
        // });

        if (!findProductReceipt[index].expired_at) {
          findProductReceipt[index].expired_at = -1;
        }
        const attributesProductOfStore = {
          product_code: findProductReceipt[index].product.code,
          product_name: findProductReceipt[index].product.name,
          product_unit: findProductReceipt[index].product.unit_name,
          product_category:
            findProductReceipt[index].product.product_category_name,
          store_id: findStoreGoodsReceipt.store_id,
          import_price: findProductReceipt[index].product.import_price,
          expired_at: findProductReceipt[index].expired_at,
        };
        // return attributesProductOfStore[index];
        const amountCurrentProductOfStore = await ProductOfStore.findOne({
          where: attributesProductOfStore,
        });
        const amountCurrent = amountCurrentProductOfStore.amount;
        await ProductOfStore.update(
          {
            amount: amountCurrent - findProductReceipt[index].amount,
          },
          { where: attributesProductOfStore, transaction }
        );
      }
      await Transaction.create(
        {
          supplier_id: findStoreGoodsReceipt.dataValues.supplier_id,
          note: "Xoá phiếu nhập " + GoodsReceipt.generateCode(),
          // amount: findStoreGoodsReceipt.dataValues.total_price - findStoreGoodsReceipt.dataValues.paid_price,
          amount: findStoreGoodsReceipt.dataValues.total_price,
          debt:
            debt_supplier_transaction +
            findStoreGoodsReceipt.dataValues.total_price,
          type: TRANSACTION_TYPE.DELETE_RECEIVE_GOODS,
        },
        { transaction }
      );
      await Transaction.create(
        {
          supplier_id: findStoreGoodsReceipt.dataValues.supplier_id,
          note: "Hoàn trả số tiền đã trả " + GoodsReceipt.generateCode(),
          amount: -findStoreGoodsReceipt.dataValues.paid_price,
          debt:
            debt_supplier_transaction +
            (findStoreGoodsReceipt.dataValues.total_price -
              findStoreGoodsReceipt.dataValues.paid_price),
          type: TRANSACTION_TYPE.DELETE_RECEIVE_GOODS,
          // type: TRANSACTION_TYPE.RETURN_MONEY_RECEIVE,
        },
        { transaction }
      );
      return updateGoodsReceipt;
    });
    const updateGooods = this.receiveGoods(req, res);
    return updateGooods;
    // return this.updateGoodsReceivedId(goods_receipt_id);
  };

  // deleteGoodsReceiptbk = async (req, res) => {
  //   const schema = Joi.object({
  //     id: Joi.number().integer().required(),
  //   }).unknown(true);
  //   let supplier: Object;
  //   let goods: Object;
  //   const { id } = await schema.validateAsync(req.query);
  //   await Promise.all([
  //     (goods = await GoodsReceipt.findOne({
  //       where: { id, is_active: IS_ACTIVE.ACTIVE },
  //     })),
  //     (supplier = await Supplier.findOne({
  //       where: { id: goods["supplier_id"], is_active: IS_ACTIVE.ACTIVE },
  //     })),
  //   ]);

  //   const findProductReceipt = await ProductReceipt.findAll({
  //     where: { goods_receipt_id: id },
  //   });

  //   let debt_supplier: number;
  //   debt_supplier = supplier["debt"] - goods["paid_price"];
  //   const lengthArr = findProductReceipt.length;

  //   const update = await sequelize.transaction(async (transaction) => {
  //     const updateGoodsReceipt = await super._update(
  //       {
  //         is_active: IS_ACTIVE.INACTIVE,
  //       },
  //       {
  //         where: { id },
  //         transaction,
  //       }
  //     );
  //     await Supplier.update(
  //       {
  //         debt: debt_supplier,
  //       },
  //       {
  //         where: { id: goods["supplier_id"], is_active: IS_ACTIVE.ACTIVE },
  //         transaction,
  //       }
  //     );
  //     for (let index = 0; index < lengthArr; index++) {
  //       const attributesProductOfStore = {
  //         product_code: findProductReceipt[index].product.code,
  //         product_name: findProductReceipt[index].product.name,
  //         product_unit: findProductReceipt[index].product.unit_name,
  //         product_category:
  //           findProductReceipt[index].product.product_category_name,
  //         store_id: goods["store_id"],
  //         import_price: findProductReceipt[index].product.import_price,
  //         // expired_at: sortArrayProducts[index].expired_at,
  //       };
  //       // return attributesProductOfStore[index];
  //       const amountCurrentProductOfStore = await ProductOfStore.findOne({
  //         where: attributesProductOfStore,
  //       });
  //       const amountCurrent = amountCurrentProductOfStore.amount;
  //       await ProductOfStore.update(
  //         {
  //           amount: amountCurrent - findProductReceipt[index].amount,
  //         },
  //         { where: attributesProductOfStore, transaction }
  //       );
  //     }
  //     return updateGoodsReceipt;
  //   });
  //   return update;
  // };

  deleteGoodsReceipt = async (req, res) => {
    const schema = Joi.object()
      .keys({
        goods_receipt_id: Joi.number().integer().required(),
      })
      .unknown(true);
    const { goods_receipt_id } = await schema.validateAsync(req.body);
    let findSupplier: Object;
    let findProductReceipt = [];
    const findGoodReceiptId = await GoodsReceipt.findOne({
      where: {
        id: goods_receipt_id,
        agent_id: req.user.agent_id,
      },
      logging: console.log,
    });
    // return findGoodReceiptId;
    if (!findGoodReceiptId) {
      throw apiCode.NOT_DELETE_CATEGORY_UCONNECT;
    }
    await Promise.all([
      (findSupplier = await Supplier.findOne({
        where: {
          id: findGoodReceiptId.supplier_id,
        },
      })),
      (findProductReceipt = await ProductReceipt.findAll({
        where: {
          goods_receipt_id,
        },
        logging: console.log,
      })),
    ]);
    const findStoreGoodsReceipt = await GoodsReceipt.findOne({
      where: { id: goods_receipt_id, is_active: IS_ACTIVE.ACTIVE },
    });
    if (!findStoreGoodsReceipt) {
      throw apiCode.DATA_NOT_EXIST;
    }
    const debt_supplier_transaction = findSupplier ? findSupplier["debt"] : 0;
    // return findSupplier["id"];
    const supplier_id = findSupplier["id"];
    const lengtArray_findProductReceipt = findProductReceipt.length;
    // return - findStoreGoodsReceipt.dataValues.paid_price;
    // return lengtArray_findProductReceipt;
    await sequelize.transaction(async (transaction) => {
      await Transaction.create(
        {
          supplier_id: findStoreGoodsReceipt.dataValues.supplier_id,
          note: "Xoá phiếu nhập " + GoodsReceipt.generateCode(),
          // amount: findStoreGoodsReceipt.dataValues.total_price - findStoreGoodsReceipt.dataValues.paid_price,
          amount: findStoreGoodsReceipt.dataValues.total_price,
          debt:
            debt_supplier_transaction +
            findStoreGoodsReceipt.dataValues.total_price,
          type: TRANSACTION_TYPE.DELETE_RECEIVE_GOODS,
        },
        { transaction }
      );
      await Transaction.create(
        {
          supplier_id: findStoreGoodsReceipt.dataValues.supplier_id,
          note: "Hoàn trả số tiền đã trả " + GoodsReceipt.generateCode(),
          amount: -findStoreGoodsReceipt.dataValues.paid_price,
          debt:
            debt_supplier_transaction +
            (findStoreGoodsReceipt.dataValues.total_price -
              findStoreGoodsReceipt.dataValues.paid_price),
          type: TRANSACTION_TYPE.RETURN_MONEY_RECEIVE,
        },
        { transaction }
      );
      const deleteGoodsReceiptId = await super._update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: goods_receipt_id },
          transaction,
        }
      );
      await ProductReceipt.update(
        {
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: {
            goods_receipt_id: goods_receipt_id,
          },
          transaction,
        }
      );
      for (let index = 0; index < lengtArray_findProductReceipt; index++) {
        if (!findProductReceipt[index].expired_at) {
          findProductReceipt[index].expired_at = -1;
        }
        const attributesProductOfStore = {
          product_code: findProductReceipt[index].product.code,
          product_name: findProductReceipt[index].product.name,
          product_unit: findProductReceipt[index].product.unit_name,
          product_category:
            findProductReceipt[index].product.product_category_name,
          store_id: findGoodReceiptId.store_id,
          import_price: findProductReceipt[index].product.import_price,
          expired_at: findProductReceipt[index].expired_at,
        };
        const findProductOfStore = await ProductOfStore.findOne({
          where: attributesProductOfStore,
        });
        const amountCurrent = findProductOfStore.amount;
        await ProductOfStore.update(
          {
            amount: amountCurrent - findProductReceipt[index].amount,
          },
          {
            where: attributesProductOfStore,
            transaction,
          }
        );
      }
      await Supplier.update(
        {
          debt:
            debt_supplier_transaction +
            (findStoreGoodsReceipt.dataValues.total_price -
              findStoreGoodsReceipt.dataValues.paid_price),
        },
        {
          where: {
            id: supplier_id,
          },
          transaction,
        }
      );
      return deleteGoodsReceiptId;
    });
    return GoodsReceipt.findOne({
      where: { id: goods_receipt_id },
    });
  };

  getListProductOfStoreBK = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        product_category: Joi.string().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
        store_id: Joi.number().integer().allow(null, ""),
      })
      .unknown(true);
    const { search, product_category, store_id } = await schema.validateAsync(
      req.query
    );
    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }

    const option = {
      [Op.or]: [
        { product_code: { [Op.substring]: search } },
        { product_name: { [Op.substring]: search } },
        { product_category: { [Op.substring]: product_category } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      store_id: store_id || { [Op.ne]: null },
      // amount: { [Op.gt]: 0 },
      agent_id: req.user.agent_id,
    };
    // return option;

    return super._findAndCountAll(
      {
        include: [
          {
            model: Store,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [sequelize.col("Store.name"), "store_name"],
            [sequelize.literal("amount*import_price"), "total_price"],
          ],
        },
        where: option,
        order: [["created_at", "DESC"]],
        limit,
        offset,
        logging: console.log,
      },
      page,
      "ProductOfStore"
    );
  };

  getListProductOfStore = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
        product_category: Joi.string().allow(null, ""),
        store_id: Joi.number().integer().allow(null, ""),
      })
      .unknown(true);
    const { search, product_category, store_id } = await schema.validateAsync(
      req.query
    );
    const product_cate = product_category ? product_category : "";
    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const queryStoreId = store_id ? "=:store_id" : "IS NOT NULL";
    const midQuery = `
   SELECT 
   \`ProductOfStore\`.*,
   \`Store\`.\`name\` AS \`store_name\`,
   \`Product\`.*,
   \`ProductOfStore\`.\`amount\` * \`Product\`.\`last_import_price\` AS \`total_price\`
   FROM 
   \`product_of_store\` AS \`ProductOfStore\`
    JOIN
   \`store\` AS \`Store\` ON \`ProductOfStore\`.\`store_id\` = \`Store\`.\`id\`
   JOIN
   \`product\` AS \`Product\` ON \`ProductOfStore\`.\`product_code\` = \`Product\`.\`code\`
   WHERE 
   (\`ProductOfStore\`.\`product_code\` LIKE '%${search}%'
     OR \`ProductOfStore\`.\`product_name\` LIKE '%${search}%'
   )
   AND \`ProductOfStore\`.\`product_category\` LIKE '%${product_cate}%'
   AND (\`ProductOfStore\`.\`created_at\` >= ${from_date} AND \`ProductOfStore\`.\`created_at\` <= ${to_date})
   AND \`ProductOfStore\`.\`is_active\`= :is_active
   AND (\`ProductOfStore\`.\`store_id\` ${queryStoreId})
   AND \`ProductOfStore\`.\`agent_id\` = :req_user_agent_id
   ORDER BY \`ProductOfStore\`.\`created_at\` DESC
   LIMIT :offset,:limit;
  `;
    const query = await sequelize.query(midQuery, {
      type: QueryTypes.SELECT,
      replacements: {
        is_active: IS_ACTIVE.ACTIVE,
        req_user_agent_id: req.user.agent_id,
        store_id: store_id,
        offset: offset,
        limit: limit,
        page: page,
      },
      logging: console.log,
    });
    return {
      data: query,
      paging: {
        page,
        totalItemCount: query.length,
        limit: CONFIG.PAGING_LIMIT,
      },
    };
  };

  getListProductReceipt = async (req, res) => {
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
    };

    return super._findAll(
      {
        where: option,
        include: [
          {
            model: ProductReceipt,
            as: "product_receipt",
          },
          ...attributesProduct["include"],
        ],
        attributes: {
          include: [
            [sequelize.col("Store.name"), "store_name"],
            [sequelize.col("User.name"), "staff_name"],
            [sequelize.col("Supplier.name"), "supplier_name"],
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

  updateGoodsReceivedId = async (id: number) => {
    return super._findOne({
      where: { id: id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesProduct,
    });
  };
  findOne = async (id: number) => {
    return super._findOne({
      where: { id: id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesProduct,
      include: [
        ...attributesProduct["include"],
        { model: ProductReceipt, as: "product_receipt" },
      ],
    });
  };
}
