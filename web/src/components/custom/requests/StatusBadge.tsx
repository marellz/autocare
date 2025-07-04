import { type RequestStatus, requestStatusLabels as labels } from '@/services/useRequestService'
import type { ReactNode } from 'react'

interface Props {
  status: RequestStatus | null
  children?: ReactNode
}
const StatusBadge = ({ status, children }: Props) => {
  const theme: Record<RequestStatus, string> = {
    empty:"bg-slate-200",
    missing_details: 'bg-red-500',
    submitted: 'bg-gray-800',
    pending: 'bg-amber-600',
    completed: 'bg-green-500',
  }

  return (
    <span className="inline-flex items-center space-x-1">
      <span className={`h-2 w-2 rounded-full ${theme[status??'empty']}`}></span>
      <p className="font-medium">{status ?labels[status] : children}</p>
    </span>
  )
}

export default StatusBadge
