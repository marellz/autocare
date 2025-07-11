import { useTheme, themeOptions } from './Provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'

const DefaultLayoutToggler = () => {
  const { theme, setTheme } = useTheme()
  const displayTheme = themeOptions.find((o) => o.value === theme)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {displayTheme && (
          <Button variant="ghost">
            <displayTheme.icon />
            <span>{displayTheme.label}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themeOptions.map((option, i) => (
          <DropdownMenuItem key={i} onClick={() => setTheme(option.value)}>
            <option.icon />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DefaultLayoutToggler
