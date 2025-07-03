export interface RequestParams<T> {
  page?: number
  limit?: number
  sort_by?: keyof T
  sort_order?: 'DESC' | 'ASC'
}

export interface ResultParams<T> extends RequestParams<T> {
  page_count?: number
  count?: number
}
