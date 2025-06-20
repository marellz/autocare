import { Badge } from '@/components/ui/badge'
import DefaultLayout from '../../layouts/Default'
import useRequestStore from '@/stores/useRequestStore'
import { useEffect } from 'react'

const Requests = () => {
  const { requests, getRequests } = useRequestStore()

  useEffect(() => {
    getRequests()
  }, [])

  // getRequests
  return (
    <DefaultLayout>
      <div>
        <div className="py-4">
          <h1 className="text-4xl">Requests</h1>
        </div>
        <div className="mt-4">
          <ul className="space-y-4">
            {!requests.length && (
              <li className="">
                <h5 className="text-lg">No requests atm.</h5>
              </li>
            )}

            {requests.map((request) => (
              <li className="" key={request.id}>
                <a href={`#"${request.name}"`} className="border block rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <p className="font-medium text-lg">{request.name}</p>
                    <Badge>{request.status}</Badge>
                  </div>
                  <p className="text-gray-500">{request.phone}</p>
                  <ul className="flex items-center gap-2">
                    {request.originalMessages.map((message, i) => (
                      <li key={`${request.id}-${i}`}>{message}</li>
                    ))}
                  </ul>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Requests
