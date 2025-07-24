import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import StatusBadge from '@/components/custom/requests/StatusBadge'
import { useState } from 'react'
import { requestStatuses, type RequestStatus } from '@/services/useRequestService'

interface Props {
  status: RequestStatus | ''
  onSelect: (status: string) => void
  asFilter?: boolean
}

const StatusSelect = ({ status, onSelect, asFilter }: Props) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (currentValue: RequestStatus | '') => {
    if (!asFilter && currentValue === '') return
    onSelect(currentValue)
    setOpen(false)
  }

  const statuses = asFilter ? [{ label: 'All', value: '' }, ...requestStatuses] : requestStatuses
  const selected = statuses.find((c) => c.value === status)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={!asFilter && status === 'missing_details'}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="lg:w-[200px] flex-auto justify-between"
        >
          <>
            {selected?.value === '' ? (
              <StatusBadge status={null}>All statuses</StatusBadge>
            ) : (
              <StatusBadge status={status}></StatusBadge>
            )}
            <ChevronsUpDown className="opacity-50" />
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {statuses.map(({ value }) => (
                <CommandItem key={value} value={value} onSelect={handleSelect} disabled={!asFilter && value==='missing_details'}>
                  {value==='' ? <StatusBadge status={null}>All statuses</StatusBadge> : <StatusBadge status={value}></StatusBadge>}
                  {value === status && <Check className={cn('ml-auto')} />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StatusSelect
