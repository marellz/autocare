import { DataTypes } from "sequelize";

export interface NewFAQ {
  title: string;
  content: string;
}

export interface FAQ extends NewFAQ {
  id: number;
}

export const FAQModelDefinition = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
};
