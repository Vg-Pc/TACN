import { IS_ACTIVE, apiCode, USER_STATUS } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";

const db = require("@models");
const { Province, sequelize, Sequelize, GoodsReceipt, GoodsReturn, Store } =
  db.default;
const { Op } = Sequelize;

const attributesUser = {};
export class StoreController extends ApplicationController {
  constructor() {
    super("Store");
  }

  create = async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    }).unknown(true);

    const { name } = await schema.validateAsync(req.body);

    const store = await super._findOne({
      where: { name, is_active: IS_ACTIVE.ACTIVE },
      logging: console.log,
    });

    if (store) throw apiCode.DATA_EXIST;

    return super._create(
      { ...req.body, agent_id: req.user.agent_id },
      {},
      ({ id }) => this.findOne(id)
    );
  };

  update = async (req, res) => {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
    }).unknown(true);

    const { id, name } = await schema.validateAsync(req.body);
    const findStore = await Store.findAll({
      where: { name, is_active: IS_ACTIVE.ACTIVE },
      logging: console.log,
    });
    //console.log(findStore.length);
    if (findStore.length != 0) throw apiCode.DATA_EXIST;
    return super._update(
      req.body,
      { where: { id, is_active: IS_ACTIVE.ACTIVE } },
      () => this.findOne(id)
    );
  };

  delete = async (req, res) => {
    const schema = Joi.object({
      id: Joi.array().items(Joi.number().integer().required()).required(),
    }).unknown(true);

    const { id } = await schema.validateAsync(req.body);

    // không xóa kho khi có phiếu nhập Hàng
    const revice = await GoodsReceipt.findAll({
      where: { store_id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
      logging: console.log,
    });
    // không xóa kho khi có phiếu trả
    const returnG = await GoodsReturn.findAll({
      where: { store_id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
      logging: console.log,
    });
    if (revice.length > 0 || returnG.length > 0) {
      throw apiCode.STORE_EXIST;
    }

    return super._update(
      { is_active: IS_ACTIVE.INACTIVE },
      {
        where: { id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
        logging: console.log,
      }
    );
  };

  getListStore = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
    }).unknown(true);

    const { search } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.or]: [{ name: { [Op.substring]: search } }],
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };

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

  getStoreDetail = async (req, res) => {
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
