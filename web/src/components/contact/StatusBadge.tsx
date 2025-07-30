import { ContactMessageStatuses, type ContactMessageStatus } from '@/services/useContactService'
import { type ReactNode } from 'react'

interface Props {
  status: ContactMessageStatus | null
  children?: ReactNode
}

const StatusBadge = ({ status, children }: Props) => {
  const labels: Record<ContactMessageStatus, string> = ContactMessageStatuses.reduce(
    (prev, current) => ({
      ...prev,
      [current.value]: current.label,
    }),
    {},
  )

  const theme: Record<ContactMessageStatus, string> = {
    pending: 'bg-slate-200',
    in_progress: 'bg-amber-600',
    closed: 'bg-green-500',
  }

  return (
    <span className="inline-flex items-center space-x-1">
      <span className={`h-2 w-2 rounded-full ${theme[status ?? 'empty']}`}></span>
      <p className="font-medium">{status ? labels[status] : children}</p>
    </span>
  )
}

export default StatusBadge
