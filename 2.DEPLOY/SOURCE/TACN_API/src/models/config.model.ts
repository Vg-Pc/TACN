import { DEFAULT_CONFIG } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Config = sequelize.define(
    "Config",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      value: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        values: Object.values(DEFAULT_CONFIG),
        validate: {
          isIn: {
            args: [Object.values(DEFAULT_CONFIG)],
            msg: "Invalid config.",
          },
        },
      },
      created_at: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: Date.now() / 1000,
        // get() {
        //   // return new Date(this.getDataValue("created_at") * 1000);
        // },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "config",
    }
  );

  Config.associate = (db) => {};

  return Config;
};
