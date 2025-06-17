import { useId, type InputHTMLAttributes } from 'react'
import { Input as CustomInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  text?: string
  prefix?: string
}

const Input = ({
  type = 'text',
  label,
  text,
  // prefix,
  // todo: implement prefix

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
      <div className="">
        {/* {prefix && (
          <span className="input-group-text" id="basic-addon1">
            {prefix}
          </span>
        )} */}
        <CustomInput type={type} id={id} {...props} />
      </div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export default Input
