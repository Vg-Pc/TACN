import { IS_ACTIVE, apiCode, USER_STATUS } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";

const db = require("@models");
const { Province, sequelize, Sequelize, Supplier } = db.default;
const { Op } = Sequelize;

const attributesUser = {
  include: [{ model: Province, attributes: [] }],
  attributes: {
    include: [[sequelize.col("Province.name"), "province_name"]],
  },
};
export class SupplierController extends ApplicationController {
  constructor() {
    super("Supplier");
  }

  create = async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      phone_number: Joi.string()
        .required()
        .pattern(new RegExp("^0[1-9]{1}[0-9]{8}$")),
      address: Joi.string().allow(null,""),
      tax_code: Joi.string().allow(null,""),
      email: Joi.string().allow(null,""),
      province_id: Joi.number().integer().required(),
    }).unknown(true);

    const { phone_number } = await schema.validateAsync(req.body);

    const supplier = await super._findOne({
      where: { phone_number, is_active: IS_ACTIVE.ACTIVE },
      logging: console.log,
    });

    if (supplier) throw apiCode.DATA_EXIST;

    const { id } = await Supplier.create(
      {
        ...req.body,
        agent_id: req.user.agent_id,
        code: Supplier.generateCode(),
      },
      {}
    );
    await Supplier.update(
      {
        code: Supplier.generateUpdateCode(id),
      },
      { where: { id: id } }
    );
    return this.findOne(id);
    /*
    return super._create(
      {
        ...req.body,
        agent_id: req.user.agent_id,
        code: Supplier.generateCode(),
      },
      {},
      ({ id }) => this.findOne(id)
    );
    */
  };

  update = async (req, res) => {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
      phone_number: Joi.string()
        .required()
        .pattern(new RegExp("^0[1-9]{1}[0-9]{8}$")),
      address: Joi.string().allow(null,""),
      tax_code: Joi.string().allow(null,""),
      email: Joi.string().allow(null,""),
      province_id: Joi.number().integer().required(),
    }).unknown(true);

    const { id } = await schema.validateAsync(req.body);

    return super._update(
      { ...req.body, code: Supplier.generateCode() },
      { where: { id, is_active: IS_ACTIVE.ACTIVE } },
      () => this.findOne(id)
    );
  };

  delete = async (req, res) => {
    const schema = Joi.object({
      id: Joi.array().items(Joi.number().integer().required()).required(),
    }).unknown(true);

    const { id } = await schema.validateAsync(req.body);

    return super._update(
      { is_active: IS_ACTIVE.INACTIVE },
      {
        where: { id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
        logging: console.log,
      }
    );
  };

  getListSupplier = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      province_id: Joi.number().integer().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
    }).unknown(true);

    const { search, province_id } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.or]: [
        { name: { [Op.substring]: search } },
        { phone_number: { [Op.substring]: search } },
      ],
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };

    if (province_id) options["province_id"] = province_id;

    return super._findAndCountAll(
      {
        ...attributesUser,
        where: options,
        order: [["id", "DESC"]],
        limit,
        offset,
      },
      page
    );
  };

  getSupplierDetail = async (req, res) => {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
    }).unknown(true);

    const { id } = await schema.validateAsync(req.params);

    return this.findOne(id);
  };

  findOne = async (id: number) => {
    return super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesUser,
    });
  };
}
