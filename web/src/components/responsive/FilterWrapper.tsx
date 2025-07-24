import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ReactNode } from 'react'
import { Button } from '../ui/button'
import { Filter } from 'lucide-react'
interface Props {
  children: ReactNode
  label?: string
}
const FilterWrapper = ({ children, label = 'Filters' }: Props) => {
  const isMobile = useIsMobile()

  if (isMobile)
    return (
      <Popover>
        <PopoverTrigger>
          <Button>
            <span>{label}</span>
            <Filter />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="flex flex-col space-y-2">{children}</div>
        </PopoverContent>
      </Popover>
    )
  return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
}

export default FilterWrapper
