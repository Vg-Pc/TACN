import { IS_ACTIVE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "unit",
          key: "id",
        },
      },
      product_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "product_category",
          key: "id",
        },
      },
      retail_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      wholesale_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      import_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
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
      last_import_price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      last_retail_price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      last_wholesale_price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: "product",
    }
  );

  Product.associate = (db) => {
    db.Product.belongsTo(db.ProductCategory, {
      foreignKey: {
        name: "product_category_id",
      },
    });
    db.Product.belongsTo(db.Unit, {
      foreignKey: {
        name: "unit_id",
      },
    });
    db.Product.hasMany(db.ProductImage, {
      foreignKey: {
        name: "product_id",
      },
      as: "product_images",
    });
  };

  Product.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `K${a}${b}${c}`;
  };

  return Product;
};
