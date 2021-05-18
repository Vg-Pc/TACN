import {
  IS_ACTIVE,
  PAYMENT_TYPE,
  SALE_TYPE,
  TRANSACTION_TYPE,
} from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define(
    "Order",
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
      paid_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      debt: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      sale_type: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: Object.values(SALE_TYPE),
        defaultValue: SALE_TYPE.RETAIL,
        validate: {
          isIn: {
            args: [Object.values(SALE_TYPE)],
            msg: "Invalid sale type.",
          },
        },
      },
      payment_type: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: Object.values(PAYMENT_TYPE),
        defaultValue: PAYMENT_TYPE.CASH,
        validate: {
          isIn: {
            args: [Object.values(PAYMENT_TYPE)],
            msg: "Invalid payment type.",
          },
        },
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
      tableName: "order",
      hooks: {
        async beforeCreate(order, { transaction }) {
          const db = require("@models");
          const { Transaction, Customer } = db.default;

          const {
            customer_id,
            paid_price,
            code,
            sale_type,
            total_price,
          } = order.dataValues;
          const customer = await Customer.findOne({
            where: { id: customer_id, is_active: IS_ACTIVE.ACTIVE },
          });
          let debt_customer: number;
          let note: string;
          if (sale_type === SALE_TYPE.WHOLESALE || sale_type === SALE_TYPE.RETAIL) {
            if (sale_type === SALE_TYPE.WHOLESALE) {
              debt_customer = customer.dataValues.debt + total_price;
              note = "Bán sỉ  " + code;
            }
            if (sale_type === SALE_TYPE.RETAIL) {
              debt_customer = customer.dataValues.debt + total_price;
              note = "Bán lẻ  " + code;
            }

            await Transaction.create(
              {
                customer_id: customer_id,
                note: note,
                amount: total_price,
                debt: debt_customer,
                type:
                  sale_type === SALE_TYPE.WHOLESALE
                    ? TRANSACTION_TYPE.SALE_GOODS_WHOLESALE
                    : TRANSACTION_TYPE.SALE_GOODS_RETAIL,
              },
              { transaction }
            );
            await Transaction.create(
              {
                customer_id: customer_id,
                note: "Thanh toán " + code,
                amount: -paid_price,
                debt: debt_customer - paid_price,
                type: TRANSACTION_TYPE.PAY,
              },
              { transaction }
            );
          }
          if (sale_type === SALE_TYPE.RETURN) {
            debt_customer = customer ? customer.dataValues.debt : 0;
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
                amount: paid_price,
                debt: debt_customer - total_price + paid_price,
                type: TRANSACTION_TYPE.PAY,
              },
              { transaction }
            );
          }
          // await Transaction.create(
          //   {
          //     customer_id,
          //     note: note,
          //     amount: paid_price,
          //     debt: debt_customer,
          //     type:
          //       sale_type == SALE_TYPE.RETURN
          //         ? TRANSACTION_TYPE.RETURN_GOODS
          //         : sale_type == SALE_TYPE.WHOLESALE // bán sỉ
          //         ? TRANSACTION_TYPE.SALE_GOODS_WHOLESALE
          //         : TRANSACTION_TYPE.SALE_GOODS_RETAIL,// bán lẻ
          //   },
          //   { transaction }
          // );
          // Do other stuff
          // console.log({ goodsReceipt, transaction });
        },
      },
    }
  );

  Order.associate = (db) => {
    db.Order.belongsTo(db.User, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.Order.belongsTo(db.Customer, {
      foreignKey: {
        name: "customer_id",
      },
    });
    db.Order.belongsTo(db.Store, {
      foreignKey: {
        name: "store_id",
      },
    });
    db.Order.hasMany(db.OrderProduct, {
      foreignKey: {
        name: "order_id",
      },
      as: "products",
    });
  };

  Order.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `ORDER${a}${b}${c}`;
  };

  return Order;
};
