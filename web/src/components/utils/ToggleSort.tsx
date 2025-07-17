import type { ReactNode } from 'react'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'
import type { Column } from '@tanstack/react-table'

interface Props<T> {
  children: ReactNode
  column: Column<T>
}

function ToggleSort<T>({ column, children }: Props<T>) {
  const isSorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      className="group/sort"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span>{children}</span>
      <ArrowUpDown
        className={`${isSorted ? 'opacity-full' : 'opacity-20 group-hover/sort:opacity-60'}`}
      />
    </Button>
  )
}

export default ToggleSort
