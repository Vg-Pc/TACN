import { IS_ACTIVE, apiCode, USER_STATUS, VOUCHER } from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";
import { is } from "sequelize/types/lib/operators";

const db = require("@models");
const { Province, sequelize, Sequelize, InvoiceType, Invoice } = db.default;
const { Op } = Sequelize;

const attributesInvoiceType = {};
export class InvoiceTypeController extends ApplicationController {
  constructor() {
    super("InvoiceType");
  }

  create = async (req, res) => {
    const schema = Joi.object()
      .keys({
        name: Joi.string().required(),
        voucher_type: Joi.number().integer().required(),
      })
      .unknown(true);

    const { name, voucher_type } = await schema.validateAsync(req.body);

    const invoice_type = await super._findOne({
      where: { name, voucher_type, is_active: IS_ACTIVE.ACTIVE },
      logging: console.log,
    });
    // return invoice_type;
    if (invoice_type) throw apiCode.DATA_EXIST;
    return super._create(
      { ...req.body, agent_id: req.user.agent_id },
      {},
      ({ id }) => this.findOne(id)
    );
  };

  update = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
        voucher_type: Joi.number().integer().required(),
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
    const checkInvoice = await Invoice.findAll({
      where: { invoice_type_id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
    });
    if (checkInvoice.length > 0) throw apiCode.INVOICE_EXIST;
    return super._update(
      { is_active: IS_ACTIVE.INACTIVE },
      {
        where: { id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE },
        logging: console.log,
      }
    );
  };

  getListInvoiceType = async (req, res) => {
    const schema = Joi.object()
      .keys({
        page: Joi.number().integer().allow(null, ""),
        search: Joi.string().allow(null, ""),
        voucher_type: Joi.number().integer().allow(null, ""),
        from_date: Joi.date().allow(null, ""),
        to_date: Joi.date().allow(null, ""),
      })
      .unknown(true);
    const { search, voucher_type } = await schema.validateAsync(req.query);
    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    // return { from_date, to_date };
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    // if (!voucher_type) {
    //   voucher_type = VOUCHER.RECEIPT || VOUCHER.PAYMENT;
    // }
    // return { from_date, to_date };
    const options = {
      name: { [Op.substring]: search },
      voucher_type: voucher_type || { [Op.ne]: null },
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],

      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };

    return super._findAndCountAll(
      {
        ...attributesInvoiceType,
        where: options,
        limit,
        offset,
        order: [["id", "DESC"]],
      },
      page
    );
  };

  getInvoiceTypeDetail = async (req, res) => {
    const schema = Joi.object()
      .keys({
        id: Joi.number().integer().required(),
      })
      .unknown(true);
    const { id } = await schema.validateAsync(req.params);
    const find_invoice_type = await InvoiceType.findOne({
      where: id,
      is_active: IS_ACTIVE.ACTIVE,
    });
    if (!find_invoice_type) {
      throw apiCode.NOT_FOUND;
    }
    return this.findOne(id);
  };

  findOne = async (id: number) => {
    return super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
      ...attributesInvoiceType,
    });
  };
}
