import DefaultLayout from '../../layouts/Default'
import { useRequestService } from '../../services/useRequestService'

const Requests = () => {
  const { requests } = useRequestService()

  // getRequests
  return (
    <DefaultLayout>
      <div>
        <div className="py-3">
          <h1 className="display-6">Requests</h1>
        </div>
        <div className="mt-4">
          <ul className="list-group">
            {!requests.length && (
              <li className="list-group-item">
                <h5 className='mb-0 fw-normal'>No requests atm.</h5>
              </li>
            )}

            {requests.map((request) => (
              <li className="list-group-item">
                <p>{request.id}</p>
                <p>{request.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Requests
