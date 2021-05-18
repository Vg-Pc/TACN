import { IS_ACTIVE, apiCode, USER_STATUS } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";

const db = require("@models");
const {
  Unit,
  ProductCategory,
  ProductImage,
  sequelize,
  Sequelize,
  Product,
  ProductOfStore,
} = db.default;
const { Op } = Sequelize;

const attributesProduct = {
  include: [
    {
      model: Unit,
      attributes: [],
      where: { is_active: IS_ACTIVE.ACTIVE },
    },
    {
      model: ProductCategory,
      attributes: [],
      where: { is_active: IS_ACTIVE.ACTIVE },
    },
  ],
  attributes: {
    include: [
      [sequelize.col("unit.name"), "unit_name"],
      [sequelize.col("ProductCategory.name"), "product_category_name"],
    ],
  },
};
export class ProductController extends ApplicationController {
  constructor() {
    super("Product");
  }
  create = async (req, res) => {
    const schema = Joi.object()
      .keys({
        name: Joi.string().required(),
        code: Joi.string().allow(null, ""),
        unit_id: Joi.number().required(),
        product_category_id: Joi.number().required(),
        retail_price: Joi.number().required(),
        wholesale_price: Joi.number().required(),
        import_price: Joi.number().required(),
        images: Joi.array().items(Joi.string().allow(null, "")).allow(null, ""),
      })
      .unknown(true);

    const { product_category_id, unit_id, images, code } = await schema.validateAsync(
      req.body
    );

    let productCategory: Object;
    let unit: Object;
    let checkProduct: Object;

    await Promise.all([
      (productCategory = await ProductCategory.findOne({
        where: { id: product_category_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (unit = await Unit.findOne({
        where: { id: unit_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (checkProduct = await Product.findAndCountAll({
        where: { code: code, is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);

    if (!productCategory || !unit) throw apiCode.NOT_FOUND;
    if (Object.keys(checkProduct["rows"]).length > 0) throw apiCode.CODE_ERROR;

    // const product = await super._findOne({
    //   where: { name, is_active: IS_ACTIVE.ACTIVE },
    // });

    // if (product) throw apiCode.DATA_EXIST;

    const productId = await sequelize.transaction(async (transaction) => {
      const { id } = await super._create(
        {
          ...req.body,
          code: code ? code : Product.generateCode(),
          agent_id: req.user.agent_id,
        },
        { transaction }
      );
      if (images) {
        await ProductImage.bulkCreate(
          images.map((url) => ({ url, product_id: id })),
          { transaction }
        );
      }

      return id;
    });

    return this.findOne(productId);
  };

  getListProduct = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
        product_category_id: Joi.number().integer().allow(null, ""),
      })
      .unknown(true);
    const { search, product_category_id } = await schema.validateAsync(
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
        { name: { [Op.substring]: search } },
        { code: { [Op.substring]: search } },
      ],
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      product_category_id: product_category_id || { [Op.ne]: null },
      is_active: IS_ACTIVE.ACTIVE || { [Op.ne]: null },
      agent_id: req.user.agent_id,
    };

    return super._findAndCountAll(
      {
        ...attributesProduct,
        where: option,
        order: [["id", "DESC"]],
        limit,
        offset,
      },
      page
    );
  };

  getProductDetail = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().required(),
      })
      .unknown(true);

    const { id } = await schema.validateAsync(req.params);

    return this.findOne(id);
  };

  update = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
        unit_id: Joi.number().required(),
        product_category_id: Joi.number().required(),
        retail_price: Joi.number().required(),
        wholesale_price: Joi.number().required(),
        import_price: Joi.number().required(),
        images: Joi.array().items(Joi.string().allow(null, "")).allow(null, ""),
        image_delete: Joi.array().allow(null, ''),
      })
      .unknown(true);
    const {
      id,
      product_category_id,
      unit_id,
      images,
      name, retail_price, wholesale_price, import_price, image_delete
    } = await schema.validateAsync(req.body);
    let productCategory: Object;
    let unit: Object;
    let product: Object;

    await Promise.all([
      (productCategory = await ProductCategory.findOne({
        where: { id: product_category_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (unit = await Unit.findOne({
        where: { id: unit_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (product = await super._findOne({
        where: { id, is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);
    // return image_delete.length;

    if (!productCategory || !unit || !product) throw apiCode.NOT_FOUND;
    let imageDelete = null;
    await sequelize.transaction(async (transaction) => {
      if (image_delete.length > 0) {
        // imageDelete = JSON.parse(`[${image_delete}]`);
        await ProductImage.update(
          { is_active: IS_ACTIVE.INACTIVE },
          { where: { id: { [Op.in]: image_delete } }, transaction }
        );
      }
      await super._update(
        { ...req.body },
        {
          where: { id, is_active: IS_ACTIVE.ACTIVE },
          transaction,
        }
      )
      if (images) {
        await ProductImage.bulkCreate(
          images.map((url) => ({ url, product_id: id })),
          { transaction }
        )
      }
    });

    return this.findOne(id);
  };

  delete = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.array().items(Joi.number().integer().required()).required(),
      })
      .unknown(true);
    // (productReturnDetail = await ProductOfStore.findAll({
    //   raw: true,
    //   where: {
    //     product_code: { [Op.in]: products.map(({ code }) => code) },
    //     is_active: IS_ACTIVE.ACTIVE,
    //     store_id: store_id
    //   },
    // })),
    const { id } = await schema.validateAsync(req.body);
    const productDetail = await Product.findAll({
      where: { id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
    });
    // return productDetail;
    const checkProductOfstore = await ProductOfStore.findAll({
      raw: true,
      where: {
        product_code: { [Op.in]: productDetail.map(({ code }) => code) },
        is_active: IS_ACTIVE.ACTIVE,
      },
    });
    if (checkProductOfstore.length > 0) {
      throw apiCode.DELETE_PRODUCT_EXITS;
    }
    return super._update(
      { is_active: IS_ACTIVE.INACTIVE },
      {
        where: {
          id: { [Op.in]: id },
          is_active: IS_ACTIVE.ACTIVE,
        }
      }
    );
  };

  findOne = async (id: number) =>
    super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesProduct,
      include: [
        ...attributesProduct["include"],
        {
          model: ProductImage,
          required: false,
          where: { is_active: IS_ACTIVE.ACTIVE },
          attributes: ["url", "id"],
          as: "product_images",
        },
      ],
    });
}
