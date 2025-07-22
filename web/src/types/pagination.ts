export interface RequestParams<T> {
  query?: string;
  where?: Record<string, string|number>
  page?: number
  limit?: number
  sort_by?: keyof T | string // todo: fix: remove string
  sort_order?: 'DESC' | 'ASC'
}

export interface ResultParams<T> extends RequestParams<T> {
  page_count?: number
  count?: number
}
