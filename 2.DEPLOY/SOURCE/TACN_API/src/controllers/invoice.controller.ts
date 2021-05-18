import {
  IS_ACTIVE,
  apiCode,
  VOUCHER,
  INVOICE_OBJECT,
  TRANSACTION_TYPE,
} from "@utils/constant";
import { ApplicationController } from ".";
import * as Joi from "joi";
import transaction from "sequelize/types/lib/transaction";

const db = require("@models");
const {
  Invoice,
  InvoiceType,
  User,
  Customer,
  Supplier,
  sequelize,
  Sequelize,
  Transaction,
} = db.default;
const { Op } = Sequelize;

const attributesUser = {
  include: [
    { model: User, attributes: [] },
    { model: Customer, attributes: [] },
    { model: Supplier, attributes: [] },
    { model: InvoiceType, attributes: [] },
  ],
  attributes: {
    include: [
      [sequelize.col("User.name"), "staff_name"],
      [sequelize.col("Customer.name"), "customer_name"],
      [sequelize.col("Supplier.name"), "supplier_name"],
      [sequelize.col("InvoiceType.name"), "invoice_type_name"],
    ],
  },
};
export class InvoiceController extends ApplicationController {
  constructor() {
    super("Invoice");
  }

  create = async (req, res) => {
    const schema = Joi.object({
      // 1 phiếu thu giảm tiền nợ bên nhà cung cấp , 2 phiếu chi tăng thêm tiền công nợ nhà cung cấp
      voucher_type: Joi.number().integer().required(),
      invoice_type_id: Joi.number().integer().required(),
      amount: Joi.number().integer().required(),
      // staff_id: Joi.number().integer().required(),
      customer_id: Joi.number().integer().allow(null, ""),
      supplier_id: Joi.number().integer().allow(null, ""),
      reason: Joi.string().required(),
    }).unknown(true);

    const {
      // staff_id,
      amount,
      customer_id,
      supplier_id,
      invoice_type_id,
      voucher_type,
    } = await schema.validateAsync(req.body);
    // return voucher_type;
    let invoiceType: Object;
    // let staff: Object;
    let customer: Object;
    let supplier: Object;

    await Promise.all([
      (invoiceType = await InvoiceType.findOne({
        where: { id: invoice_type_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      // (staff = await User.findOne({
      //   where: { id: staff_id, is_active: IS_ACTIVE.ACTIVE },
      // })),
      (supplier = await Supplier.findOne({
        where: { id: supplier_id, is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);
    let debt: number;
    // tính số tiền công nợ
    if (supplier) {
      // return 1;
      debt =
        invoiceType["voucher_type"] == VOUCHER.RECEIPT
          ? supplier["debt"] - amount
          : supplier["debt"] + amount;
    }
    if (customer) {
      debt =
        invoiceType["voucher_type"] == VOUCHER.RECEIPT
          ? customer["debt"] - amount
          : customer["debt"] + amount;
    }
    // return { invoiceType, customer, supplier, debt };
    if (!invoiceType || (!customer && !supplier)) throw apiCode.NOT_FOUND;
    const invoiceId = await sequelize.transaction(async (transaction) => {
      const { id } = await super._create(
        {
          ...req.body,
          code:
            voucher_type == VOUCHER.RECEIPT
              ? Invoice.generateReceiptCode()
              : Invoice.generatePaymentCode(),
          agent_id: req.user.agent_id,
          staff_id: req.user.id,
        },
        { transaction }
      );
      if (supplier) {
        await Supplier.update(
          {
            debt,
          },
          {
            where: { id: supplier_id, is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        );
      }
      if (customer) {
        await Customer.update(
          {
            debt,
          },
          {
            where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        );
      }
      return id;
    });
    return this.findOne(invoiceId);
  };

  update = async (req, res) => {
    const schema = Joi.object({
      invoice_id: Joi.number().integer().required(),
      voucher_type: Joi.number().integer().required(),
      invoice_type_id: Joi.number().integer().required(),
      amount: Joi.number().integer().required(),
      // staff_id: Joi.number().integer().required(),
      customer_id: Joi.number().integer().allow(null, ""),
      supplier_id: Joi.number().integer().allow(null, ""),
      reason: Joi.string().required(),
    }).unknown(true);

    const {
      invoice_id,
      voucher_type,
      customer_id,
      supplier_id,
      invoice_type_id,
      amount,
    } = await schema.validateAsync(req.body);

    let invoiceType: Object;
    let invoice: Object;
    let customer: Object;
    let supplier: Object;

    await Promise.all([
      (invoice = await Invoice.findOne({
        where: { id: invoice_id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (invoiceType = await InvoiceType.findOne({
        where: { id: invoice["invoice_type_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: invoice["customer_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (supplier = await Supplier.findOne({
        where: { id: invoice["supplier_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);
    // return { invoiceType, customer, supplier };
    if (!invoiceType || (!customer && !supplier)) throw apiCode.NOT_FOUND;
    // kiểm tra phiếu có thay đổi hay k và tính số tiền
    let debt: number;
    // let debt_new: number;

    // tính số tiền công nợ
    // return invoice["supplier_id"];
    // nếu phiếu k thay đổi sub hoặc cus
    if (supplier) {
      if (invoice["voucher_type"] == VOUCHER.RECEIPT) {
        // if (supplier["debt"] >= 0) {
        //   debt = supplier["debt"] - invoice["amount"];
        // } else {
        //   debt = supplier["debt"] + invoice["amount"];
        // }
        debt = supplier["debt"] + invoice["amount"];
      }
      if (invoice["voucher_type"] == VOUCHER.PAYMENT) {
        debt = supplier["debt"] - invoice["amount"];
        // if (supplier["debt"] >= 0) {
        //   debt = supplier["debt"] - invoice["amount"];
        // } else {
        //   debt = supplier["debt"] + invoice["amount"];
        // }
        // invoice["voucher_type"] == VOUCHER.PAYMENT
        //   ? supplier["debt"] + invoice["amount"] - amount
        //   : supplier["debt"] + invoice["amount"];
      }
    }
    if (customer) {
      if (invoice["voucher_type"] == VOUCHER.RECEIPT) {
        debt = customer["debt"] + invoice["amount"];
      }
      if (invoice["voucher_type"] == VOUCHER.PAYMENT) {
        debt = customer["debt"] - invoice["amount"];
      }
    }
    // return debt;
    // return { supplier, supplier_new, customer_new, customer };
    // nếu phiếu thay đổi sub hoặc cus
    // if (supplier_new && invoice["supplier_id"] != supplier_id) {
    //   // if (!supplier_new && !customer_new) throw apiCode.NOT_FOUND;
    //   if (supplier) {
    //     debt =
    //       invoice["voucher_type"] == VOUCHER.RECEIPT
    //         ? supplier["debt"] + invoice["amount"]
    //         : supplier["debt"] - invoice["amount"];
    //   } else {
    //     debt =
    //       invoice["voucher_type"] == VOUCHER.RECEIPT
    //         ? customer["debt"] + invoice["amount"]
    //         : customer["debt"] - invoice["amount"];
    //   }
    //   debt_new =
    //     invoiceType["voucher_type"] == VOUCHER.RECEIPT
    //       ? supplier_new["debt"] - amount
    //       : supplier_new["debt"] + amount;
    // }
    // if (customer_new && invoice["customer_id"] != customer_id) {
    //   // if (!supplier_new && !customer_new) throw apiCode.NOT_FOUND;
    //   if (supplier) {
    //     debt =
    //       invoice["voucher_type"] == VOUCHER.RECEIPT
    //         ? supplier["debt"] + invoice["amount"]
    //         : supplier["debt"] - invoice["amount"];
    //   } else {
    //     debt =
    //       invoice["voucher_type"] == VOUCHER.RECEIPT
    //         ? customer["debt"] + invoice["amount"]
    //         : customer["debt"] - invoice["amount"];
    //   }
    //   debt_new =
    //     invoiceType["voucher_type"] == VOUCHER.RECEIPT
    //       ? customer_new["debt"] - amount
    //       : customer_new["debt"] + amount;
    // }
    // return invoice["supplier_id"];
    const invoiceId = await sequelize.transaction(async (transaction) => {
      await super._update(
        {
          // ...req.body,
          // code:
          //   voucher_type == VOUCHER.RECEIPT
          //     ? Invoice.generateReceiptCode()
          //     : Invoice.generatePaymentCode(),
          // agent_id: req.user.agent_id,
          // staff_id: req.user.id,
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id: invoice_id, is_active: IS_ACTIVE.ACTIVE },
          transaction,
        }
      );
      if (supplier) {
        await Supplier.update(
          {
            debt: debt,
          },
          {
            where: { id: invoice["supplier_id"], is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        );
      }
      if (customer) {
        await Customer.update(
          {
            debt: debt,
          },
          {
            where: { id: invoice["customer_id"], is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        );
      }
      await Transaction.create(
        {
          customer_id: invoice["customer_id"],
          supplier_id: invoice["supplier_id"],
          note:
            invoice["voucher_type"] == VOUCHER.RECEIPT
              ? "Xoá phiếu thu " + Invoice.generateReceiptCode()
              : "Xoá phiếu chi " + Invoice.generatePaymentCode(),
          debt: debt,
          amount:
            invoice["voucher_type"] == VOUCHER.RECEIPT
              ? invoice["amount"]
              : -invoice["amount"],
          type:
            invoice["voucher_type"] == VOUCHER.RECEIPT
              ? TRANSACTION_TYPE.INVOICE_RECEIPT
              : TRANSACTION_TYPE.INVOICE_PAYMENT,
        },
        { transaction }
      );
    });
    return this.create(req, res);
  };

  delete = async (req, res) => {
    const schema = Joi.object({
      // id: Joi.array().items(Joi.number().integer().required()).required(),
      id: Joi.number().integer().required(),
    }).unknown(true);
    let invoice: Object;
    let invoiceType: Object;
    let customer: Object;
    let supplier: Object;
    const { id } = await schema.validateAsync(req.body);
    await Promise.all([
      (invoice = await Invoice.findOne({
        where: { id, is_active: IS_ACTIVE.ACTIVE },
      })),
      (invoiceType = await InvoiceType.findOne({
        where: { id: invoice["invoice_type_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (customer = await Customer.findOne({
        where: { id: invoice["customer_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
      (supplier = await Supplier.findOne({
        where: { id: invoice["supplier_id"], is_active: IS_ACTIVE.ACTIVE },
      })),
    ]);
    // invoice = await Invoice.findOne({
    //   include: [
    //     { model: User, attributes: [] },
    //     { model: Customer, attributes: [] },
    //     { model: Supplier, attributes: [] },
    //     { model: InvoiceType, attributes: [] },
    //   ],
    //   attributes: {
    //     include: [
    //       [sequelize.col("User.name"), "staff_name"],
    //       [sequelize.col("Customer.name"), "customer_name"],
    //       [sequelize.col("Supplier.name"), "supplier_name"],
    //       [sequelize.col("InvoiceType.name"), "invoice_type_name"],
    //     ],
    //   },
    //   where: {
    //     id,
    //     is_active: IS_ACTIVE.ACTIVE,
    //   },
    // });
    if (!invoice) throw apiCode.NOT_FOUND;
    let debt: number;
    // console.log(invoice["id"]);
    // return invoiceType["voucher_type"];
    if (supplier) {
      if (invoice["voucher_type"] == VOUCHER.RECEIPT) {
        debt = supplier["debt"] + invoice["amount"];
      }
      if (invoice["voucher_type"] == VOUCHER.PAYMENT) {
        debt = supplier["debt"] - invoice["amount"];
      }
    }
    if (customer) {
      if (invoice["voucher_type"] == VOUCHER.RECEIPT) {
        debt = customer["debt"] + invoice["amount"];
      }
      if (invoice["voucher_type"] == VOUCHER.PAYMENT) {
        debt = customer["debt"] - invoice["amount"];
      }
    }
    // return customer["customer_id"];
    // if (invoice["supplier_id"]) {
    //   // return 1;
    //   debt =
    //     invoiceType["voucher_type"] == VOUCHER.RECEIPT
    //       ? supplier["debt"] + invoice["amount"]
    //       : supplier["debt"] - invoice["amount"];
    // }
    // if (invoice["customer_id"]) {
    //   debt =
    //     invoiceType["voucher_type"] == VOUCHER.RECEIPT
    //       ? customer["debt"] + invoice["amount"]
    //       : customer["debt"] - invoice["amount"];
    // }
    const invoiceId = await sequelize.transaction(async (transaction) => {
      await super._update(
        {
          // ...req.body,
          // code:
          //   voucher_type == VOUCHER.RECEIPT
          //     ? Invoice.generateReceiptCode()
          //     : Invoice.generatePaymentCode(),
          // agent_id: req.user.agent_id,
          // staff_id: req.user.id,
          is_active: IS_ACTIVE.INACTIVE,
        },
        {
          where: { id, is_active: IS_ACTIVE.ACTIVE },
          transaction,
        }
      );
      if (supplier) {
        await Supplier.update(
          {
            debt: debt,
          },
          {
            where: { id: invoice["supplier_id"], is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        );
      }
      if (customer) {
        await Customer.update(
          {
            debt: debt,
          },
          {
            where: { id: invoice["customer_id"], is_active: IS_ACTIVE.ACTIVE },
            transaction,
          }
        );
      }
      await Transaction.create(
        {
          customer_id: customer ? customer["id"] : null,
          supplier_id: supplier ? supplier["id"] : null,
          note:
            invoice["voucher_type"] == VOUCHER.RECEIPT
              ? "Xoá phiếu thu " + Invoice.generateReceiptCode()
              : "Xoá phiếu chi " + Invoice.generatePaymentCode(),
          debt: debt,
          amount:
            invoice["voucher_type"] == VOUCHER.RECEIPT
              ? invoice["amount"]
              : -invoice["amount"],
          type:
            invoice["voucher_type"] == VOUCHER.RECEIPT
              ? TRANSACTION_TYPE.INVOICE_RECEIPT
              : TRANSACTION_TYPE.INVOICE_PAYMENT,
        },
        { transaction }
      );
    });
    return invoiceId;
    // return super._update(
    //   { is_active: IS_ACTIVE.INACTIVE },
    //   {
    //     where: { id: { [Op.in]: id }, is_active: IS_ACTIVE.ACTIVE, debt },
    //   }
    // );
  };

  getListInvoice = async (req, res) => {
    const schema = Joi.object({
      page: Joi.number().integer().allow(null, ""),
      search: Joi.string().allow(null, ""),
      from_date: Joi.date().allow(null, ""),
      to_date: Joi.date().allow(null, ""),
      invoice_type_id: Joi.number().integer().allow(null, ""),
      voucher_type: Joi.number().integer().allow(null, ""),
      staff_id: Joi.number().integer().allow(null, ""),
      invoice_object: Joi.number().integer().allow(null, ""),
    }).unknown(true);

    const {
      search,
      invoice_type_id,
      voucher_type,
      staff_id,
      invoice_object,
    } = await schema.validateAsync(req.query);

    const { page, limit, offset } = req.query;
    let { from_date, to_date } = req.query;
    if (!from_date || !to_date) {
      from_date = 0;
      to_date = Date.now() / 1000;
    }
    const options = {
      [Op.or]: [{ code: { [Op.substring]: search } }],
      [Op.and]: [
        { created_at: { [Op.gte]: from_date } },
        { created_at: { [Op.lte]: to_date } },
      ],
      is_active: IS_ACTIVE.ACTIVE,
      agent_id: req.user.agent_id,
    };

    if (invoice_type_id) options["invoice_type_id"] = invoice_type_id;
    if (voucher_type) options["voucher_type"] = voucher_type;
    if (staff_id) options["staff_id"] = staff_id;

    if (invoice_object && invoice_object == INVOICE_OBJECT.CUSTOMER)
      options["customer_id"] = { [Op.ne]: null };

    if (invoice_object && invoice_object == INVOICE_OBJECT.SUPPLIER)
      options["supplier_id"] = { [Op.ne]: null };

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

  getInvoiceDetail = async (req, res) => {
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
