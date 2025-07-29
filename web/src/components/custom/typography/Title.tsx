import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

const TypTitle = ({ children, className }: Props) => {
  return (
    <h1 className={clsx('text-2xl md:text-3xl lg:text-4xl font-bold', className)}>{children}</h1>
  )
}

export default TypTitle
