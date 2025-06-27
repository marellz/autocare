import { DataTypes } from "sequelize";
import { VendorRequest } from "./vendorRequest.model";
export default {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brands: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  brands: string[];
  location: string | null;
  vendor_requests?: VendorRequest[];
  createdAt: Date;
  updatedAt: Date | null;
}

export interface NewVendor {
  name: string;
  phone: string;
  brands: string[];
  location?: string | null;
  createdAt?: Date;
}
