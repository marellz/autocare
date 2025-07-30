import { DataTypes } from "sequelize";

export interface NewContactMessage {
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface ContactMessage extends NewContactMessage {
  id: number;
  updatedAt?: Date | null;
  closedAt?: Date | null;
  status: ContactMessageStatus;
}

export enum ContactMessageStatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

export type ContactMessageStatus = `${ContactMessageStatusEnum}`;

export const ContactMessageModelDefinition = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: ContactMessageStatusEnum.PENDING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};
