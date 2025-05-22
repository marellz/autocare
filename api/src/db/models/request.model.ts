import { DataTypes } from "sequelize";
export default {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  channel: { // communication channel
    allowNull: false,
    type: DataTypes.STRING,
  },
  item: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  capturedDetails: {
    allowNull: true,
    type: DataTypes.STRING
  },
  missingDetails:{ // array of details as string
    allowNull: true,
    type: DataTypes.STRING
  },
  status: { // missing_details, pending, completed
    allowNull: false,
    type: DataTypes.STRING
  },
  fulfilled_at: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

export interface Request {
  id: string;
  name: string|null;
  phone: string;
  channel: string;
  item: string;
  capturedDetails: string | null;
  missingDetails: string | null;
  status: string;
  fulfilled_at: string | null;
}

export interface NewRequest {
  name: string | null;
  phone: string;
  channel: string;
  item: string;
  capturedDetails?: string | null;
  missingDetails?: string | null;
  status: string;
  fulfilled_at?: string | null;
}
