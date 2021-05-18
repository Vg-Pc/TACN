import { IS_ACTIVE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Store = sequelize.define(
    "Store",
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
      tableName: "store",
    }
  );

  Store.associate = (db) => {
    db.Store.hasMany(db.GoodsReceipt, {
      foreignKey: {
        name: "store_id",
      },
    });
    db.Store.hasMany(db.Order, {
      foreignKey: {
        name: "store_id",
      },
    });
    db.Store.hasMany(db.GoodsReturn, {
      foreignKey: {
        name: "store_id",
      },
    });
    db.Store.hasMany(db.ProductOfStore, {
      foreignKey: {
        name: "store_id",
      },
    });
  };

  return Store;
};
