import { IS_ACTIVE, apiCode, USER_STATUS, ROLE } from "@utils/constant";
import { ApplicationController } from "./";
import * as Joi from "joi";
import * as bcrypt from "bcryptjs";

const db = require("@models");
const {
  Role,
  Province,
  sequelize,
  Sequelize,
  User,
  Store,
  InvoiceType,
} = db.default;
const { Op } = Sequelize;

const attributesUser = {
  include: [
    { model: Role, attributes: [] },
    { model: Province, attributes: [] },
  ],
  attributes: {
    include: [
      [sequelize.col("Role.role"), "role"],
      [sequelize.col("Province.name"), "province_name"],
    ],
    // exclude: ["token"],
  },
};
export class UsersController extends ApplicationController {
  constructor() {
    super("User");
  }

  login = async (req, res) => {
    const schema = Joi.object({
      phone_number: Joi.string()
        .required()
        .pattern(new RegExp("^0[1-9]{1}[0-9]{8}$")),
      password: Joi.string().required(),
    }).unknown(true);

    const { phone_number, password } = await schema.validateAsync(req.body);

    const user = await super._findOne({
      where: { phone_number, is_active: IS_ACTIVE.ACTIVE },
    });

    if (!user || !user.authenticate(password)) throw apiCode.LOGIN_FAIL;

    return super._update(
      { token: user.generateToken() },
      {
        where: { phone_number, is_active: IS_ACTIVE.ACTIVE },
      },
      () => this.findOne(user.id)
    );
  };

  logout = async (req, res) =>
    super._update(
      { token: null },
      {
        where: { id: req.user.id, is_active: IS_ACTIVE.ACTIVE },
        logging: console.log,
      }
    );

  create = async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      agent_name: Joi.string().allow(null, ""),
      phone_number: Joi.string()
        .required()
        .pattern(new RegExp("^0[1-9]{1}[0-9]{8}$")),
      address: Joi.string().required(),
      password: Joi.string().required(),
      date_of_birth: Joi.number().integer().required(),
      expired_at: Joi.number().integer().required(),
      gender: Joi.number().integer().required(),
      email: Joi.string().required(),
      role_id: Joi.number().integer().required(),
      province_id: Joi.number().integer().required(),
    }).unknown(true);
    const { phone_number, role_id, expired_at } = await schema.validateAsync(req.body);

    const user = await super._findOne({
      where: { phone_number, is_active: IS_ACTIVE.ACTIVE },
    });

    // return user;

    if (user) throw apiCode.ACCOUNT_EXIST;
    const user_create = await super._findOne({
      where: { id: req.user.id, is_active: IS_ACTIVE.ACTIVE },
    });
    // return user_create;
    let agent_id: number;
    agent_id = user_create.dataValues.agent_id
      ? req.user.agent_id
      : req.user.id;
    if (role_id == 3) {
      agent_id = null;
    }
    // await this.createStore(agent_id);
    const user_id = await super._create(
      {
        ...req.body,
        agent_id: role_id == ROLE.AGENT ? null : agent_id,
        expired_at: user_create.role_id == ROLE.AGENT ? user_create.expired_at : expired_at,
      },
      {}
      // ({ id }) => this.findOne(id)
    );
    await this.createStore(user_id.id, agent_id);
    return this.findOne(user_id.id);
  };

  // tạo kho
  createStore = async (id: number, agent_id: number) => {
    // Tạo kho
    const name = "Kho trung tâm";
    const store = await await Store.findAll({
      where: {
        agent_id: agent_id,
        name: { [Op.substring]: "Kho trung tâm" },
        is_active: IS_ACTIVE.ACTIVE,
      },
    });
    if (store.length == 0) {
      await Store.create({ name: name, agent_id: agent_id ? agent_id : id });
    }
    // Tạo 2 loại phiếu nhập
    const nameReceipt = "Phiếu thu";
    const namePayment = "Phiếu chi";
    const invoice_type = await InvoiceType.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: nameReceipt } },
          { name: { [Op.substring]: namePayment } },
        ],
        is_active: IS_ACTIVE.ACTIVE,
        agent_id: agent_id,
      },
    });
    // return invoice_type;
    if (invoice_type.length == 0) {
      await InvoiceType.create({
        name: nameReceipt,
        voucher_type: 1,
        agent_id: agent_id ? agent_id : id,
      });
      await InvoiceType.create({
        name: namePayment,
        voucher_type: 2,
        agent_id: agent_id ? agent_id : id,
      });
    }
  };

  update = async (req, res) => {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      agent_name: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string().required(),
      date_of_birth: Joi.number().integer().required(),
      expired_at: Joi.number().integer().required(),
      gender: Joi.number().integer().required(),
      email: Joi.string().required(),
      role_id: Joi.number().integer().required(),
      province_id: Joi.number().integer().required(),
    }).unknown(true);

    const {
      id,
      name,
      address,
      date_of_birth,
      expired_at,
      gender,
      email,
      role_id,
      province_id,
      agent_name,
    } = await schema.validateAsync(req.body);
    const checkAgent = User.findOne({
      where: {
        id,
        is_active: IS_ACTIVE.ACTIVE,
        role_id: ROLE.AGENT,
      },
    });
    if (checkAgent && role_id != ROLE.AGENT) throw apiCode.ACCOUNT_EXIST_ROLE;
    // return checkAgent;
    // lấy ds nhân viên
    const getListStaff = User.update(
      { expired_at: expired_at ? expired_at : checkAgent.expired_at },
      {
        where: {
          agent_id: id,
          is_active: IS_ACTIVE.ACTIVE,
          role_id: ROLE.STAFF,

        },
      }
    );
    return super._update(
      {
        name,
        address,
        date_of_birth,
        expired_at,
        gender,
        email,
        role_id,
        province_id,
        agent_name,
      },
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
      }
    );
  };

  getListUser = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      role_id: Joi.number().integer().allow(null, ""),
      status: Joi.number().integer().allow(null, ""),
      province_id: Joi.number().integer().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
    }).unknown(true);

    const { search, role_id, status, province_id } = await schema.validateAsync(
      req.query
    );

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    let options = {
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
        {
          // [Op.or]: [{agent_id: req.user.id}, { id: req.user.agent_id },{agent_id: null}]
          [Op.or]:
            req.user.role_id == ROLE.AGENT
              ? [{ agent_id: req.user.agent_id }, { id: req.user.id }]
              : [
                { agent_id: req.user.agent_id },
                { id: req.user.agent_id },
                { agent_id: null },
              ],
        },
        {
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { phone_number: { [Op.substring]: search } },
          ],
        },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      // agent_id: { [Op.ne]: null },
    };
    if (role_id) options["role_id"] = role_id;
    if (Object.values(USER_STATUS).includes(status)) options["status"] = status;
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

  getUserInfo = async (req, res) => this.findOne(req.user.id);

  getUserDetail = async (req, res) => {
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

  resetPassword = async (req, res) => {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
    }).unknown(true);

    const { id } = await schema.validateAsync(req.body);

    const user = await super._findOne({
      where: { id, is_active: IS_ACTIVE.ACTIVE },
    });

    if (!user) throw apiCode.NOT_FOUND;

    await User.update(
      {
        password: bcrypt.hashSync(
          user.phone_number,
          bcrypt.genSaltSync(10),
          null
        ),
      },
      { where: { id, is_active: IS_ACTIVE.ACTIVE } }
    );

    return this.findOne(id);
  };

  updatePassword = async (req, res) => {
    const schema = Joi.object({
      old_password: Joi.string().required(),
      new_password: Joi.string().required(),
    }).unknown(true);

    const { old_password, new_password } = await schema.validateAsync(req.body);
    const check_customer = await User.findOne({
      where: {
        is_active: IS_ACTIVE.ACTIVE,
        id: req.user.id,
      },
    });
    if (check_customer.password) {
      if (bcrypt.compareSync(new_password, check_customer.password))
        throw apiCode.PASSWORD_ERROR;
      if (!bcrypt.compareSync(old_password, check_customer.password))
        throw apiCode.PASSWORD_FAIL;
    }
    await User.update(
      {
        password: bcrypt.hashSync(new_password, bcrypt.genSaltSync(10), null),
      },
      { where: { id: req.user.id, is_active: IS_ACTIVE.ACTIVE } }
    );

    return this.findOne(req.user.id);
  };
}
