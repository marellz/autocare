import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { brandOptions } from '@/stores/useVendorStore'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  onChange: (brands: string[]) => void
  brands: string[]
}

const VendorBrandSelect = ({ onChange, brands }: Props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>(brands)

  useEffect(() => {
    onChange(value)
  }, [value])

  const handleSelect = (brand: string) => {
    if (value.includes(brand)) {
      setValue(brands.filter((i) => i !== brand))
    } else {
      setValue([...brands, brand])
    }
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto"
        >
          <div className="text-left">
            <p>{value.length ? `${value.length} selected` : 'Select brands'}</p>
            <p className="text-muted-foreground text-xs text-wrap">
              {value.length ? value.join(', ') : 'No brands selected'}
            </p>
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-0 border rounded-lg mt-4">
        <Command className='max-h-[200px]'>
          <CommandInput placeholder="Search for a brand..." />
          <CommandList>
            <CommandEmpty>No such name.</CommandEmpty>
            <CommandGroup>
              {brandOptions.map((brand) => (
                <CommandItem key={brand} value={brand} onSelect={handleSelect}>
                  <span className="flex-auto">{brand}</span>
                  {value.includes(brand) && <Check />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default VendorBrandSelect
