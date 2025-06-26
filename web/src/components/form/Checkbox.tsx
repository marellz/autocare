import { useId, type ReactNode } from 'react'
import { Checkbox as CustomCheckbox } from '../ui/checkbox'
import { Label } from '../ui/label'

interface Props {
  text?: string
  disabled?: boolean
  required?: boolean
  onCheckedChange: () => void
  checked: boolean
  children: ReactNode
}

const Checkbox = ({ children, text, ...props }: Props) => {
  const id = useId()

  return (
    <div className="flex items-center space-x-2">
      <CustomCheckbox {...props} id={id} />
      <div className="grid gap-2">
        <Label htmlFor={id}>{children}</Label>
        {text && <p className="text-muted-foreground text-sm">{text}</p>}
      </div>
    </div>
  )
}

export default Checkbox
