import { IS_ACTIVE } from "@utils/constant";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "supplier",
          key: "id",
        },
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customer",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
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
      debt: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "transaction",
    }
  );

  Transaction.associate = (db) => {
    db.Transaction.belongsTo(db.Supplier, {
      foreignKey: {
        name: "supplier_id",
      },
    });
    db.Transaction.belongsTo(db.Customer, {
      foreignKey: {
        name: "customer_id",
      },
    });
  };

  return Transaction;
};
