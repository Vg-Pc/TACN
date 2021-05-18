import { IS_ACTIVE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Supplier = sequelize.define(
    "Supplier",
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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_code: {
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
        allowNull: false,
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
      tableName: "supplier",
    }
  );

  Supplier.associate = (db) => {
    db.Supplier.belongsTo(db.Province, {
      foreignKey: {
        name: "province_id",
      },
    });
    db.Supplier.hasMany(db.GoodsReceipt, {
      foreignKey: {
        name: "supplier_id",
      },
    });
    db.Supplier.hasMany(db.Invoice, {
      foreignKey: {
        name: "supplier_id",
      },
    });
    db.Supplier.hasMany(db.Invoice, {
      foreignKey: {
        name: "supplier_id",
      },
    });
  };
  Supplier.generateUpdateCode = function generateUpdateCode(id: number) {
    const a = "00000";
    const b = id;
    const c = `${a}${b}`;
    const codeSup = c.slice(-6);
    return `SUP${codeSup}`;
  };

  Supplier.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `SUP${a}${b}${c}`;
  };

  return Supplier;
};
