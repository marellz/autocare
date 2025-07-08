import { useId, type InputHTMLAttributes } from 'react'
import { Input as CustomInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  text?: string
  prefix?: string
  margin?: string
  error?: string | null
}

const Input = ({ type = 'text', label, text, margin = 'mb-4', error, ...props }: Props) => {
  const id = useId()

  return (
    <div className={`space-y-2 ${margin}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div>
        <CustomInput className={`${error&&'border-red-500'}`} type={type} id={id} {...props} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export default Input
