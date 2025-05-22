import { DataTypes } from 'sequelize';
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
  // communication channel : whatsapp | sms | web
  channel: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  originalMessages: {
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  item: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  capturedDetails: {
    allowNull: false,
    type: DataTypes.JSONB,
  },

  // array of details as string
  missingDetails: {
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  
  // missing_details, pending, completed
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fulfilled_at: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

export enum CarPartDetailEnum {
  PART_NAME = 'partName',
  CAR_BRAND = 'carBrand',
  CAR_MODEL = 'carModel',
  CAR_VARIANT = 'carVariant',
  CAR_YEAR = 'carYear',
}

export type CarPartDetail = `${CarPartDetailEnum}`;

export const carPartDetailLables: Record<keyof CapturedDetails, string> = {
  [CarPartDetailEnum.PART_NAME]: 'part name',
  [CarPartDetailEnum.CAR_BRAND]: ' car brand/make',
  [CarPartDetailEnum.CAR_MODEL]: 'car model',
  [CarPartDetailEnum.CAR_VARIANT]: 'car variant',
  [CarPartDetailEnum.CAR_YEAR]: 'car year or generation',
};

export type CapturedDetails = Record<CarPartDetail, string | null>;

export interface Request {
  id: string;
  name: string | null;
  phone: string;
  channel: string;
  item: string;
  originalMessages: string[];
  capturedDetails: Partial<CapturedDetails>;
  missingDetails: string[];
  status: string;
  fulfilled_at: string | null;
}

export interface NewRequest {
  name?: string | null;
  phone: string;
  channel: string;
  item: string;
  originalMessages: string[];
  capturedDetails: Partial<CapturedDetails>;
  missingDetails: string[];
  status: string;
  fulfilled_at?: string | null;
}
