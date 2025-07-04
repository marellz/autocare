import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { requestChannels, type RequestChannel } from '@/services/useRequestService'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

interface Props {
  channel: RequestChannel | ''
  onSelect: (channel: string) => void
}

const ChannelSelect = ({ channel, onSelect }: Props) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (currentValue: RequestChannel | '') => {
    onSelect(currentValue)
    setOpen(false)
  }

  const channels = [{ label: 'All', value: '' }, ...requestChannels]
  const selected = requestChannels.find(c=>c.value === channel)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected?.label ?? 'All channels'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {channels.map(({label, value}) => (
                <CommandItem
                  key={value}
                  value={value}
                  onSelect={handleSelect}
                >
                  <span>{label}</span>
                  {value === channel && <Check className="ml-auto" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ChannelSelect
