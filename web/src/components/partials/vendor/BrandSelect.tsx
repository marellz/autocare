import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { brandOptions } from '@/stores/useVendorStore'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

interface Props {
  brand: string | null;
  onSelect: (brand: string | null) => void
}
const BrandSelect = ({ onSelect, brand }: Props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(brand)

  const handleSelect = (brand: string | null) => {
    setValue(brand)
    onSelect(brand)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ?? 'Select brand'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search for a brand..." />
          <CommandList>
            <CommandEmpty>No such name.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="" onSelect={() => handleSelect(null)}>
                <span className="flex-auto">All brands</span>
                {!value && <Check />}
              </CommandItem>
              {brandOptions.map((brand) => (
                <CommandItem key={brand} value={brand} onSelect={handleSelect}>
                  <span className="flex-auto">{brand}</span>
                  {value === brand && <Check />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default BrandSelect
