import {
  type ContactMessageStatus,
  ContactMessageStatuses as statuses,
} from '@/services/useContactService'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import clsx from 'clsx'
import StatusBadge from './StatusBadge'

interface Props {
  status: ContactMessageStatus | ''
  onSelect: (status: ContactMessageStatus | '') => void
}
const StatusSelect = ({ status, onSelect }: Props) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (currentValue: ContactMessageStatus | '') => {
    onSelect(currentValue)
    setOpen(false)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="lg:w-[200px] flex-auto justify-between"
        >
          <>
            {status === '' ? (
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
                <CommandItem key={value} value={value} onSelect={handleSelect}>
                  {value === '' ? (
                    <StatusBadge status={null}>All statuses</StatusBadge>
                  ) : (
                    <StatusBadge status={value}></StatusBadge>
                  )}
                  {value === status && <Check className={clsx('ml-auto')} />}
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
