import { IS_ACTIVE, apiCode, USER_STATUS } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";

const db = require("@models");
const { Province, sequelize, Sequelize } = db.default;
const { Op } = Sequelize;

export class ProvinceController extends ApplicationController {
  constructor() {
    super("Province");
  }
  getListProvince = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
      })
      .unknown(true);
    const { search } = await schema.validateAsync(req.query);
    const { page, limit, offset } = req.query;
    const option = {
      [Op.or]: [{ name: { [Op.substring]: search } }],
      is_active: IS_ACTIVE.ACTIVE,
    };

    return super._list({
      where: option,
    });
  };
}
