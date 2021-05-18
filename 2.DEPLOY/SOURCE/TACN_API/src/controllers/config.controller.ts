import { IS_ACTIVE, apiCode, USER_STATUS } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";

const db = require("@models");
const { Province, sequelize, Sequelize } = db.default;
const { Op } = Sequelize;

const attributesUser = {};
export class ConfigController extends ApplicationController {
  constructor() {
    super("Config");
  }

  update = async (req, res) => {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
    }).unknown(true);

    const { id } = await schema.validateAsync(req.body);

    return super._update(
      req.body,
      { where: { id, is_active: IS_ACTIVE.ACTIVE } },
      () => this.findOne(id)
    );
  };

  getConfig = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
    }).unknown(true);

    const { search } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;

    const options = {
      [Op.or]: [{ name: { [Op.substring]: search } }],
      is_active: IS_ACTIVE.ACTIVE,
    };

    return super._list();
  };

  findOne = async (id: number) => {
    return super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesUser,
    });
  };
}
