import { IS_ACTIVE, apiCode, USER_STATUS } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";

const db = require("@models");
const { Province, sequelize, Sequelize } = db.default;
const { Op } = Sequelize;

const attributesUnit = {};
export class UnitController extends ApplicationController {
  constructor() {
    super("Unit");
  }
  create = async (req, res) => {
    const schema = Joi.object()
      .keys({
        name: Joi.string().required(),
      })
      .unknown(true);
    const { name } = await schema.validateAsync(req.body);
    let agent_id = req.user.agent_id;
    if(agent_id == null){
      agent_id = req.user.id;
    }
    const unit = await super._findOne({
      where: { name, is_active: IS_ACTIVE.ACTIVE, agent_id: agent_id  },
    });
    if (unit) {
      throw apiCode.DATA_EXIST;
    }
    return super._create(
      { ...req.body, agent_id: agent_id },
      {},
      ({ id }) => this.findOne(id)
    );
  };

  update = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
      })
      .unknown(true);
    const { id } = await schema.validateAsync(req.body);
    return super._update(
      req.body,
      { where: { id, is_active: IS_ACTIVE.ACTIVE } },
      () => this.findOne(id)
    );
  };

  delete = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.array().items(Joi.number().integer().required()).required(),
      })
      .unknown(true);
    const { id } = await schema.validateAsync(req.body);
    return super._update(
      { is_active: IS_ACTIVE.INACTIVE },
      {
        where: { id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
        logging: console.log,
      }
    );
  };

  getListUnit = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
      })
      .unknown(true);

    const { search } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }

    const option = {
      [Op.or]: [{ name: { [Op.substring]: search } }],
      is_active: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      agent_id: req.user.agent_id,
    };
    return super._findAndCountAll(
      {
        ...attributesUnit,
        where: option,
        limit,
        offset,
        order: [["id", "DESC"]],
      },
      page
    );
  };

  getListDetailUnit = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().integer().required(),
      })
      .unknown(true);
    const { id } = await schema.validateAsync(req.params);
    return this.findOne(id);
  };

  findOne = async (id: number) => {
    return super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesUnit,
    });
  };
}
