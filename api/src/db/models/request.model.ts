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
  PART_NAME = "partName",
  CAR_BRAND = "carBrand",
  CAR_MODEL = "carModel",
  CAR_VARIANT = "carVariant",
  CAR_YEAR = "carYear",
  ENGINE_SIZE = "engineSize",
  TRANSMISSION = "transmission",
  BODY_TYPE = "bodyType",
}

export type CarPartDetail = `${CarPartDetailEnum}`;

export const carPartDetailLables: Record<keyof CapturedDetails, string> = {
  [CarPartDetailEnum.PART_NAME]: "Part name",
  [CarPartDetailEnum.CAR_BRAND]: " Car brand/make e.g BMW, Mercededs, Toyota",
  [CarPartDetailEnum.CAR_MODEL]:
    "Car model e.g 3-series, C-class, Mark X, Corolla",
  [CarPartDetailEnum.CAR_VARIANT]: "Car variant e.g 320i, C200, 250G, 5A/7A",
  [CarPartDetailEnum.CAR_YEAR]: "Car year e.g 2001",
  [CarPartDetailEnum.TRANSMISSION]: "Transmission type e.g Automatic, Manual",
  [CarPartDetailEnum.ENGINE_SIZE]: "Car engine size in cc e.g 2000",
  [CarPartDetailEnum.BODY_TYPE]: "Car body type e.g Sedan, Coupe, Convertible",
};

export type CapturedDetails = Record<CarPartDetail, string | null>;

export enum RequestStatusEnum {
  MISSING_DETAILS = "missing_details",
  PENDING = "pending",
  COMPLETED = "completed",
}
export type RequestStatus = `${RequestStatusEnum}`;

export interface Request {
  id: string;
  name: string | null;
  phone: string;
  channel: string;
  item: string;
  originalMessages: string[];
  capturedDetails: Partial<CapturedDetails>;
  missingDetails: string[];
  status: RequestStatus;
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
  status: RequestStatus;
  fulfilled_at?: string | null;
}
