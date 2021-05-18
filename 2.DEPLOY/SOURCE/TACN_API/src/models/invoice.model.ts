import { IS_ACTIVE, VOUCHER, TRANSACTION_TYPE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      voucher_type: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: Object.values(VOUCHER),
        defaultValue: VOUCHER.RECEIPT,
        validate: {
          isIn: {
            args: [Object.values(VOUCHER)],
            msg: "Invalid voucher.",
          },
        },
      },
      invoice_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "invoice_type",
          key: "id",
        },
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      reason: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customer",
          key: "id",
        },
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "supplier",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      modified_at: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: Date.now() / 1000,
        // get() {
        //   // return new Date(this.getDataValue("created_at") * 1000);
        // },
      },
      is_active: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: Object.values(IS_ACTIVE),
        defaultValue: IS_ACTIVE.ACTIVE,
        validate: {
          isIn: {
            args: [Object.values(IS_ACTIVE)],
            msg: "Invalid status.",
          },
        },
      },
      agent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "invoice",
      hooks: {
        async beforeCreate(invoice, { transaction }) {
          const db = require("@models");
          const { Transaction, Supplier, Invoice, Customer } = db.default;
          console.log(invoice.dataValues);
          const {
            customer_id,
            voucher_type,
            code,
            supplier_id,
            amount,
          } = invoice.dataValues;
          const supplier = await Supplier.findOne({
            where: { id: supplier_id, is_active: IS_ACTIVE.ACTIVE },
          });
          const customer = await Customer.findOne({
            where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
          });
          let debt_transaction: number;
          if (voucher_type === VOUCHER.RECEIPT) {
            if (supplier_id) {
              debt_transaction = supplier.dataValues.debt - amount;
            }
            if (customer_id) {
              debt_transaction = customer.dataValues.debt - amount;
            }
          } if (voucher_type === VOUCHER.PAYMENT) {
            if (supplier_id) {
              debt_transaction = supplier.dataValues.debt + amount;
            }
            if (customer_id) {
              debt_transaction = customer.dataValues.debt + amount;
            }
          }
          await Transaction.create(
            {
              customer_id,
              supplier_id,
              note:
                voucher_type == VOUCHER.RECEIPT
                  ? "Tạo phiếu thu " + code
                  : "Tạo phiếu chi " + code,
              amount: voucher_type == VOUCHER.RECEIPT ? -amount : amount,
              debt: debt_transaction,
              type:
                voucher_type == VOUCHER.RECEIPT
                  ? TRANSACTION_TYPE.INVOICE_RECEIPT
                  : TRANSACTION_TYPE.INVOICE_PAYMENT,
            },
            { transaction }
          );
        },
      },
    }
  );

  Invoice.associate = (db) => {
    db.Invoice.belongsTo(db.User, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.Invoice.belongsTo(db.Customer, {
      foreignKey: {
        name: "customer_id",
      },
    });
    db.Invoice.belongsTo(db.Supplier, {
      foreignKey: {
        name: "supplier_id",
      },
    });
    db.Invoice.belongsTo(db.InvoiceType, {
      foreignKey: {
        name: "invoice_type_id",
      },
    });
  };

  function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `${a}${b}${c}`;
  }

  Invoice.generateReceiptCode = function generateReceiptCode() {
    return `R${generateCode()}`;
  };

  Invoice.generatePaymentCode = function generatePaymentCode() {
    return `P${generateCode()}`;
  };

  return Invoice;
};
