import { IS_ACTIVE, PAYMENT_TYPE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const ProductOfStore = sequelize.define(
    "ProductOfStore",
    {
      code: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      product_code: {
        allowNull: false,
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      product_name: {
        allowNull: false,
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      product_unit: {
        allowNull: false,
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      product_category: {
        allowNull: false,
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "store",
          key: "id",
        },
        primaryKey: true,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      import_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
        primaryKey: true,
      },
      last_price: {
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
      expired_at: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "product_of_store",
    }
  );

  ProductOfStore.associate = (db) => {
    db.ProductOfStore.belongsTo(db.Store, {
      foreignKey: {
        name: "store_id",
      },
    });
  };

  ProductOfStore.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `POS${a}${b}${c}`;
  };

  return ProductOfStore;
};
