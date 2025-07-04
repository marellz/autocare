import ChannelSelect from '@/components/custom/requests/ChannelSelect'
import StatusSelect from '@/components/custom/requests/StatusSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { RequestChannel, RequestStatus } from '@/services/useRequestService'
import useRequestStore from '@/stores/useRequestStore'
import { CircleSlash, Search } from 'lucide-react'
import { useState } from 'react'

// todo: fix pagination and filter mis-alignment
// pagination should work alongside filters
const RequestFilters = () => {
  const { getRequests } = useRequestStore()
  const [query, setQuery] = useState<string>('')
  const [status, setStatus] = useState<RequestStatus | ''>('')
  const [channel, setChannel] = useState<RequestChannel | ''>('')

  const handleSubmit = () => {

    // generate a clean object, no empty, "''" values
    const payload = Object.entries({ query, status, channel })
      .filter((p) => p[1] !== '')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

    if (!Object.keys(payload).length) return false
    getRequests(payload)
  }

  const disabledSubmit = [query,status, channel].every(i=>i==='')

  const resetFilters = () => {
    setQuery('')
    setStatus('')
    setChannel('')

    getRequests({})
  }

  return (
    <div className="flex gap-4">
      <Input
        value={query}
        placeholder="Search user, phone, message..."
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      />
      <ChannelSelect channel={channel} onSelect={setChannel} />
      <StatusSelect status={status} onSelect={setStatus} asFilter></StatusSelect>
      <Button type="button" onClick={resetFilters} variant="outline">
        <span>Reset</span>
        <CircleSlash />
      </Button>
      <Button type="submit" onClick={handleSubmit} disabled={disabledSubmit}>
        <Search />
        <span>Search</span>
      </Button>
    </div>
  )
}

export default RequestFilters
