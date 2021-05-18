import {
  IS_ACTIVE,
  PAYMENT_TYPE,
  SALE_TYPE,
  TRANSACTION_TYPE,
} from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const GoodsReturn = sequelize.define(
    "GoodsReturn",
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
      note: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      first_discount: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      second_discount: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customer",
          key: "id",
        },
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "store",
          key: "id",
        },
      },
      goods_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      total_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      return_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      // debt: {
      //   type: DataTypes.BIGINT,
      //   allowNull: true,
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
      tableName: "goods_return",
      hooks: {
        async beforeCreate(GoodsReturn, { transaction }) {
          console.log("before creaet");
          const db = require("@models");
          const { Transaction, Customer } = db.default;
          const {
            customer_id,
            return_price,
            code,
            total_price,
          } = GoodsReturn.dataValues;
          const customer = await Customer.findOne({
            where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
          });
          // console.log(return_price);
          const debt_customer = customer ? customer.dataValues.debt : 0;
          // console.log(debt_customer - total_price + return_price, return_price, total_price, debt_customer);
          await Transaction.create(
            {
              customer_id,
              note: "Khách trả hàng " + code,
              amount: -total_price,
              debt: debt_customer - total_price,
              type: TRANSACTION_TYPE.RETURN_GOODS,
            },
            { transaction }
          );
          await Transaction.create(
            {
              customer_id,
              note: "Thanh toán " + code,
              amount: return_price,
              debt: debt_customer - total_price + return_price,
              type: TRANSACTION_TYPE.PAY,
            },
            { transaction }
          );
          // Do other stuff
          // console.log({ goodsReceipt, transaction });
        },
      },
    }
  );

  GoodsReturn.associate = (db) => {
    db.GoodsReturn.belongsTo(db.User, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.GoodsReturn.belongsTo(db.Customer, {
      foreignKey: {
        name: "customer_id",
      },
    });
    db.GoodsReturn.belongsTo(db.Store, {
      foreignKey: {
        name: "store_id",
      },
    });
    db.GoodsReturn.hasMany(db.ProductReturn, {
      foreignKey: {
        name: "goods_return_id",
      },
      as: "products",
    });
  };

  GoodsReturn.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `R${a}${b}${c}`;
  };

  return GoodsReturn;
};
