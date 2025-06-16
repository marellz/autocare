import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  text?: string
  children: ReactNode
}

const Input = ({ children, text, ...props }: Props) => {
  const id = useId()

  return (
    <div className="mb-3">
      <div className="form-check">
        <input className="form-check-input" type="radio" {...props} id={id} />
        <label className="form-check-label" htmlFor={id}>
          {children}
        </label>
      </div>
      {text && <p className="form-text">{text}</p>}
    </div>
  )
}

export default Input
