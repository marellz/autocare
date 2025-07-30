import { CircleSlash, Search } from 'lucide-react'

import FilterWrapper from '../responsive/FilterWrapper'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState } from 'react'
import type { ContactMessageStatus } from '@/services/useContactService'
import StatusSelect from './StatusSelect'
import useContactStore from '@/stores/useContactStore'

const ContactFilters = () => {
  const { updateParams } = useContactStore()
  const [query, setQuery] = useState<string>('')
  const [status, setStatus] = useState<ContactMessageStatus | ''>('')

  const disabledSubmit = [query, status].every((i) => i === '')
  const handleSubmit = () => {
    // generate a clean object, no empty, "''" values
    const payload = Object.entries({ query, status })
      .filter((p) => p[1] !== '')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

    if (!Object.keys(payload).length) return false

    updateParams({ ...payload, page: 1 })
  }
  const resetFilters = () => {
    setQuery('')
    setStatus('')

    updateParams({
      query: '',
      status: '',
      page: 1,
    })
  }

  return (
    <FilterWrapper>
      <Input
        value={query}
        placeholder="Search user, email, phone, message..."
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      />
      <StatusSelect status={status} onSelect={setStatus}></StatusSelect>
      <div className="flex items-center space-x-4 justify-end md:col-start-2 lg:col-start-auto">
        <Button type="button" onClick={resetFilters} variant="outline">
          <span>Reset</span>
          <CircleSlash />
        </Button>
        <Button
          type="submit"
          className="flex-auto"
          onClick={handleSubmit}
          disabled={disabledSubmit}
        >
          <Search />
          <span>Search</span>
        </Button>
      </div>
    </FilterWrapper>
  )
}

export default ContactFilters
