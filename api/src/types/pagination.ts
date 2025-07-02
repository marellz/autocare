import { WhereOptions } from "sequelize";
export type PaginationSortBy = "id" | "createdAt";
export type PaginationSortOrder = "ASC" | "DESC";
export interface FindAllParams<T> {
  where?: WhereOptions<T>;
  sort_by: PaginationSortBy;
  sort_order: PaginationSortOrder
  page: number;
  page_size: number;
}
