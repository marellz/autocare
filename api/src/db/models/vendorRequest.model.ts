import { DataTypes } from "sequelize";
export default {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

export interface VendorRequest {
  id: number;
  vendorId: string;
  requestId: string;
  condition: string | null;
  price: string | null;
  notes: string | null;
}

export interface NewVendorRequest {
  id?: number;
  vendorId: string;
  requestId: string;
  condition?: string | null;
  price?: string | null;
  notes?: string | null;
}

export interface VendorRequestProperties {
  available?: boolean;
  condition: string;
  price: string;
  notes?: string | null;
}

export enum VendorResponseEnum {
  AVAILABLE = "available",
  CONDITION = "condition",
  PRICE = "price",
  NOTES = "notes",
}

export type VendorResponseKeys = `${VendorResponseEnum}`;