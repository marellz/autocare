import { useId, type InputHTMLAttributes } from 'react'

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
    <div className="mb-3">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        className="form-control"
        rows={rows}
        id={id}
        {...props}
      />
      {text && <p className="form-text">{text}</p>}
    </div>
  )
}

export default Input
