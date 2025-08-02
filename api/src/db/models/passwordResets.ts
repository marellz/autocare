import { DataTypes } from "sequelize";

export default {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

export interface NewPasswordReset {
  email: string;
  token: string;
  expiresAt: string;
}

export interface PasswordReset extends NewPasswordReset {
  id: number;
}
