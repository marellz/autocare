import { useId, type InputHTMLAttributes } from 'react'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  rows?: number
  label?: string
  text?: string
}

const Input = ({
  rows,
  label,
  text,

  ...props
}: Props) => {
  const id = useId()

  return (
    <div className="mb-4 space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
        </Label>
      )}
      <Textarea
        rows={rows}
        id={id}
        {...props}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export default Input
