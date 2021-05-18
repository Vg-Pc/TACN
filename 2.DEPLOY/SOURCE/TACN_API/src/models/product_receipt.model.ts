import { IS_ACTIVE, PAYMENT_TYPE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const ProductReceipt = sequelize.define(
    "ProductReceipt",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      product: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      goods_receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "goods_receipt",
          key: "id",
        },
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.BIGINT,
      },
      // discount: {
      //   allowNull: false,
      //   type: DataTypes.BIGINT,
      // },
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
      expired_at: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "product_receipt",
    }
  );

  ProductReceipt.associate = (db) => {
    db.ProductReceipt.belongsTo(db.GoodsReceipt, {
      foreignKey: {
        name: "goods_receipt_id",
      },
    });
  };

  return ProductReceipt;
};
