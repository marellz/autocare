import { RequestModel, VendorModel } from "../db/sequelize";
import z from "zod";

const requestColumns = Object.keys(RequestModel.getAttributes()) as [string, ...string[]]
export const RequestPaginationSchema = z.object({
  query: z.string(),

  status: z.string(),
  channel: z.string(),
  phone: z.string(),

  page: z.number(),
  limit: z.number(),
  sort_by: z.enum(requestColumns),
  sort_order: z.enum(["ASC", "DESC"]),
});


const vendorColumns = Object.keys(VendorModel.getAttributes()) as [string, ...string[]]
export const VendorPaginationSchema = z.object({
  query: z.string(),

  brand: z.string(),
  
  page: z.number(),
  limit: z.number(),
  sort_by: z.enum(vendorColumns),
  sort_order: z.enum(["ASC", "DESC"]),
});