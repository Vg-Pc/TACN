import { createJWToken } from "@config/auth";
import { IS_ACTIVE, USER_STATUS, GENDER } from "@utils/constant";
import * as bcrypt from "bcryptjs";
require("dotenv").config();
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
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
      agent_name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      phone_number: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [6, 100],
        },
      },
      date_of_birth: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      gender: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: Object.values(GENDER),
        validate: {
          isIn: {
            args: [Object.values(GENDER)],
            msg: "Invalid gender.",
          },
        },
      },
      token: {
        type: DataTypes.STRING,
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
      status: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: Object.values(USER_STATUS),
        defaultValue: USER_STATUS.ACTIVE,
        validate: {
          isIn: {
            args: [Object.values(USER_STATUS)],
            msg: "Invalid status.",
          },
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "role",
          key: "id",
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
      modified_at: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      expired_at: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        // get() {
        //   // return new Date(this.getDataValue("created_at") * 1000);
        // },
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
      // indexes: [{ unique: true, fields: ["phone_number"] }],
      timestamps: false,
      freezeTableName: true,
      tableName: "user",
      hooks: {},
    }
  );

  User.associate = (db) => {
    db.User.belongsTo(db.Role, {
      foreignKey: {
        name: "role_id",
      },
    });
    db.User.belongsTo(db.Province, {
      foreignKey: {
        name: "province_id",
      },
    });
    db.User.hasMany(db.GoodsReceipt, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.User.hasMany(db.Order, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.User.hasMany(db.GoodsReturn, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.User.hasMany(db.Invoice, {
      foreignKey: {
        name: "staff_id",
      },
    });
    db.User.hasMany(db.Invoice, {
      foreignKey: {
        name: "staff_id",
      },
    });
  };

  User.beforeSave((user, options) => {
    console.log({ user });
    if (user.changed("password")) {
      console.log({ user });
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      );
    }
  });

  User.prototype.generateToken = function generateToken() {
    return createJWToken({ phone_number: this.phone_number, id: this.id });
  };

  User.prototype.authenticate = function authenticate(value) {
    if (bcrypt.compareSync(value, this.password)) return true;
    else return false;
  };
  return User;
};
