import { useId, type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  text?: string
  prefix?: string
}

const Input = ({
  type = 'text',
  label,
  text,
  prefix,

  ...props
}: Props) => {
  const id = useId()

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="input-group">
        {prefix && (
          <span className="input-group-text" id="basic-addon1">
            {prefix}
          </span>
        )}
        <input className="form-control" type={type} id={id} {...props} />
      </div>
      {text && <p className="form-text">{text}</p>}
    </div>
  )
}

export default Input
