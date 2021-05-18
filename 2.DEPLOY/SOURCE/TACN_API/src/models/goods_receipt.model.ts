import { IS_ACTIVE, PAYMENT_TYPE, TRANSACTION_TYPE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const GoodsReceipt = sequelize.define(
    "GoodsReceipt",
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
      // first_discount: {
      //   allowNull: true,
      //   type: DataTypes.FLOAT,
      // },
      // second_discount: {
      //   allowNull: true,
      //   type: DataTypes.FLOAT,
      // },
      staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "supplier",
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
      // expired_at: {
      //   type: DataTypes.INTEGER(10),
      //   allowNull: false,
      // },
      modified_at: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        // defaultValue: Date.now() / 1000,
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
      tableName: "goods_receipt",
      hooks: {
        async beforeCreate(goodsReceipt, { transaction }) {
          console.log("before creaet");
          const db = require("@models");
          const { Transaction, Supplier } = db.default;
          const {
            supplier_id,
            paid_price,
            code,
            total_price,
          } = goodsReceipt.dataValues;
          const supplier = await Supplier.findOne({
            where: { id: supplier_id, is_active: IS_ACTIVE.ACTIVE },
          });
          const debt_supplier = supplier ? supplier.dataValues.debt : 0;
          await Transaction.create(
            {
              supplier_id,
              note: "Nhập hàng " + code,
              amount: -total_price,
              debt: -total_price + debt_supplier,
              type: TRANSACTION_TYPE.RECEIVE_GOODS,
            },
            { transaction }
          );
          await Transaction.create(
            {
              supplier_id,
              note: "Thanh toán " + code,
              amount: paid_price,
              debt: -total_price + paid_price + debt_supplier,
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

  GoodsReceipt.associate = (db) => {
    db.GoodsReceipt.belongsTo(db.User, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.GoodsReceipt.belongsTo(db.Supplier, {
      foreignKey: {
        name: "supplier_id",
      },
    });
    db.GoodsReceipt.belongsTo(db.Store, {
      foreignKey: {
        name: "store_id",
      },
    });
    db.GoodsReceipt.hasMany(db.ProductReceipt, {
      foreignKey: {
        name: "goods_receipt_id",
      },
      as: "product_receipt",
    });
  };
  GoodsReceipt.generateUpdateCode = function generateUpdateCode(id: number) {
    const a = "00000";
    const b = id;
    const c = `${a}${b}`;
    const codeImp = c.slice(-6);
    return `NH${codeImp}`;
  };
  GoodsReceipt.generateCode = function generateCode() {
    const date = Date.now().toString();
    const a = date.substring(9);
    const b = date.substring(7, 11);
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const c = (Math.floor(Math.random() * (max - min)) + min).toString();
    return `NH${a}${b}${c}`;
  };

  return GoodsReceipt;
};
