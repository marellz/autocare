import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DataTablePagination } from './DataTablePagination'
import { useEffect, useState } from 'react'
import type { ResultParams } from '@/types/pagination'
import Loader from './Loader'
import { CircleSlash } from 'lucide-react'

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  params: Partial<ResultParams<TData>>
  onParameterChange: (params: ResultParams<TData>) => void
  onClickRow?: (id: number) => void
  loading?: boolean
}

interface PaginationData {
  pageIndex: number
  pageSize: number
}

const DataTable = <TData, TValue>({
  columns,
  data,
  params,
  onClickRow,
  onParameterChange,
  loading,
}: Props<TData, TValue>) => {
  const { page_count: pageCount, page, limit, sort_by, sort_order } = params

  const [pagination, setPagination] = useState<PaginationData>({
    pageIndex: page ? page - 1 : 0, //  compensate index vs actual
    pageSize: limit ?? 10,
  })

  const [sorting, setSorting] = useState<SortingState>([
    { id: (sort_by ?? 'id') as string, desc: sort_order === 'DESC' },
  ])

  useEffect(() => {
    const { pageIndex, pageSize: limit } = pagination
    const { id: sort_by, desc } = sorting[0]
    const sort_order = desc ? 'DESC' : 'ASC'

    // fix: compare and run ONLY if something has changed

    console.log([pagination.pageIndex, pagination.pageSize, sorting[0]?.id, sorting[0]?.desc])

    onParameterChange({ sort_by, sort_order, page: pageIndex + 1, limit })
  }, [pagination.pageIndex, pagination.pageSize, sorting[0]?.id, sorting[0]?.desc])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    state: { pagination: pagination, sorting },
    onPaginationChange: (v) => {
      setPagination(v)
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  const handleRowClick = (id: string) => {
    const numberId = Number(id)
    if (onClickRow && numberId) onClickRow(numberId)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  style={{
                    maxWidth: `${header.getSize()}px`,
                  }}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Loader />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => handleRowClick(row.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex space-x-4 items-center justify-center">
                  <CircleSlash className="opacity-30" />
                  <p className="text-center text-base py-4">
                    <span className="font-medium">Empty. </span>
                    <span className="text-muted-foreground">No data/rows.</span>
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!loading && pageCount && pageCount > 1 ? (
        <DataTablePagination table={table}></DataTablePagination>
      ) : (
        ''
      )}
    </div>
  )
}

export default DataTable
