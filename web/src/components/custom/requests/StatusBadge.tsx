import { Badge } from '@/components/ui/badge'
import type { RequestStatus } from '@/services/useRequestService'

interface Props {
  status: RequestStatus
}
const StatusBadge = ({ status }: Props) => {
  const labels: Record<RequestStatus, string> = {
    missing_details: 'Missing details',
    submitted: 'Submitted',
    pending: 'Pending',
    completed: 'Completed',
  }

  const theme: Record<RequestStatus, string> = {
    missing_details: 'bg-red-100 text-red-500',
    submitted: 'bg-gray-100 text-gray-800',
    pending: 'bg-amber-100 text-amber-600',
    completed: 'bg-green-100 text-green-500',
  }
  return <Badge className={theme[status]}>{labels[status]}</Badge>
}

export default StatusBadge
