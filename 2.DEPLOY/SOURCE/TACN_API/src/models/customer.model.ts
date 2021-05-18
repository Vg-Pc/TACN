import { IS_ACTIVE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define(
    "Customer",
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
      phone_number: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date_of_birth: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      gender: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      representative: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6, 128],
            msg: "Email address must be between 6 and 128 characters in length",
          },
          isEmail: {
            msg: "Email address must be valid",
          },
        },
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "province",
          key: "id",
        },
      },
      debt: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
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
      tableName: "customer",
    }
  );

  Customer.associate = (db) => {
    db.Customer.belongsTo(db.Province, {
      foreignKey: {
        name: "province_id",
      },
    });
    db.Customer.hasMany(db.Order, {
      foreignKey: {
        name: "customer_id",
      },
    });
    db.Customer.hasMany(db.GoodsReturn, {
      foreignKey: {
        name: "customer_id",
      },
    });
    db.Customer.hasMany(db.Invoice, {
      foreignKey: {
        name: "customer_id",
      },
    });
    db.Customer.hasMany(db.Transaction, {
      foreignKey: {
        name: "customer_id",
      },
    });
  };

  Customer.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `CUS${a}${b}${c}`;
  };

  return Customer;
};
