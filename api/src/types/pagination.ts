import { WhereOptions } from "sequelize";
export type PaginationSortBy = string;
export type PaginationSortOrder = "ASC" | "DESC";
export interface FindAllParams<T> {
  where?: WhereOptions<T>;
  sort_by: PaginationSortBy;
  sort_order: PaginationSortOrder
  page: number;
  limit: number;
  query?: string
}
