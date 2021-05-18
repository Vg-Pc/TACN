import { IS_ACTIVE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Province = sequelize.define(
    "Province",
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
      code: {
        allowNull: false,
        type: DataTypes.STRING(10),
      },
      // modified_at: {
      //   type: DataTypes.INTEGER(10),
      //   allowNull: true,
      // },
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
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "province",
    }
  );

  Province.associate = (db) => {
    db.Province.hasMany(db.User, {
      foreignKey: {
        name: "province_id",
      },
    });
    db.Province.hasMany(db.Customer, {
      foreignKey: {
        name: "province_id",
      },
    });
    db.Province.hasMany(db.Supplier, {
      foreignKey: {
        name: "province_id",
      },
    });
  };

  return Province;
};
