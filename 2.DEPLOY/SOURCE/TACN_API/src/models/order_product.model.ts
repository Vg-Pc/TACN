import { IS_ACTIVE, PAYMENT_TYPE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const OrderProduct = sequelize.define(
    "OrderProduct",
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
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "order",
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
      //   allowNull: true,
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
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "order_product",
    }
  );

  OrderProduct.associate = (db) => {
    db.OrderProduct.belongsTo(db.Order, {
      foreignKey: {
        name: "order_id",
      },
    });
  };

  return OrderProduct;
};
