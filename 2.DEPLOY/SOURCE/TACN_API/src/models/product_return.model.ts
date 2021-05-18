import { IS_ACTIVE, PAYMENT_TYPE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const ProductReturn = sequelize.define(
    "ProductReturn",
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
      goods_return_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "goods_return",
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
      expired_at: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
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
      tableName: "product_return",
    }
  );

  ProductReturn.associate = (db) => {
    db.ProductReturn.belongsTo(db.GoodsReturn, {
      foreignKey: {
        name: "goods_return_id",
      },
    });
  };

  ProductReturn.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `ORDER${a}${b}${c}`;
  };

  return ProductReturn;
};
