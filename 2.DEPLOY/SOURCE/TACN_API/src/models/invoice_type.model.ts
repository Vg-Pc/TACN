import { IS_ACTIVE, VOUCHER } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const InvoiceType = sequelize.define(
    "InvoiceType",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
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
      tableName: "invoice_type",
    }
  );

  InvoiceType.associate = (db) => {
    db.InvoiceType.hasMany(db.Invoice, {
      foreignKey: {
        name: "invoice_type_id",
      },
    });
  };

  return InvoiceType;
};
