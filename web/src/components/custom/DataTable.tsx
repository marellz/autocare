import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DataTablePagination } from './DataTablePagination'
import { useEffect, useState } from 'react'
import type { ResultParams } from '@/types/pagination'

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: ResultParams<TData>
  onPaginationChange: (page: number, page_size: number) => void
  onClickRow?: (id: number) => void
}

const DataTable = <TData, TValue>({
  columns,
  data,
  pagination,
  onClickRow,
  onPaginationChange,
}: Props<TData, TValue>) => {
  const { page_count: pageCount, page, limit } = pagination

  const [paginationData, setPaginationData] = useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: page ? page - 1 : 0, //  compensate index vs actual
    pageSize: limit ?? 10,
  })

  useEffect(() => {
    // compensate index vs actual
    onPaginationChange(paginationData.pageIndex + 1, paginationData.pageSize)
  }, [paginationData])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: { pagination: paginationData },
    onPaginationChange: setPaginationData,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleRowClick = (id: string) => {
    const numberId = Number(id)
    if (onClickRow && numberId) onClickRow(numberId)
  }

  // todo: implement loading state

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
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
              <TableCell colSpan={columns.length}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pageCount && pageCount > 1 && <DataTablePagination table={table}></DataTablePagination>}
    </div>
  )
}

export default DataTable
