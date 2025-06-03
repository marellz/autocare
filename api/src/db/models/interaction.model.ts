import { DataTypes } from "sequelize";
import { RequestModel, VendorModel } from "../sequelize";

export enum InteractionTypes {
  // new request
  CLIENT_REQUEST = "client_request", // inbound

  // responding to client request, asking more info
  CLIENT_REQUEST_UPDATE = "client_request_update", // inbound

  // requested more info from system
  SYSTEM_REQUEST_UPDATE = " system_request_update", // outbound

  // acknowledging request as complete.
  SYSTEM_REQUEST_ACKNOWLEDGE = "system_request_acknowledge", // outbound

  // assign the request to a vendor.
  SYSTEM_VENDOR_REQUEST = "system_vendor_request", // outbound

  // vendor responds to request
  VENDOR_REQUEST_QUOTE = "vendor_request_response", // inbound

  //   system asks for more info from vendor, or correction
  SYSTEM_VENDOR_REQUEST_UPDATE = "system_vendor_request_update", // outbound

  // system acknowledges vendor response
  SYSTEM_VENDOR_ACKNOWLEDGE = "system_vendor_acknowledge", // outbound

  // system responding to client, closing process
  SYSTEM_REQUEST_RESPONSE = "system_request_response", // outbound
}

export enum InteractionDirectionEnum {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

export type InteractionDirection = `${InteractionDirectionEnum}`;

export interface Interaction {
  id: string;
  direction: InteractionDirection;
  type: InteractionTypes;
  phone: string;
  message: string;
  requestId: string;
  vendorId: string | null;
  metadata: JSON;
}

export interface NewInteraction {
  direction: InteractionDirection;
  type: InteractionTypes;
  phone: string;
  message: string;
  requestId: string;
  vendorId?: string | null;
  metadata: JSON;
}

export const InteractionModelDefinition = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  direction: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RequestModel,
      key: "id",
    },
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: VendorModel,
      key: "id",
    },
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
};
