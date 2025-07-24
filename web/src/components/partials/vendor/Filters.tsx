import React, { useState } from 'react'
import BrandSelect from './BrandSelect'
import useVendorStore from '@/stores/useVendorStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CircleSlash, Search } from 'lucide-react'
import type { VendorRequestParams } from '@/services/useVendorService'
import FilterWrapper from '@/components/responsive/FilterWrapper'

const VendorFilters = () => {
  const { updateParams } = useVendorStore()
  const [query, setQuery] = useState<string>('')
  const [brand, setBrand] = useState<string | null>(null)
  const handleQueryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
  }

  const handleQueryFormSubmit = () => {
    const payload: VendorRequestParams = {}
    if (query) payload.query = query
    if (brand) payload.brand = brand

    updateParams(payload)
  }

  const resetFilters = () => {
    setQuery('')
    setBrand(null)
    updateParams({ query: '', brand: '' })
  }

  const disableSubmit = query === '' && (brand === null || brand === '')

  return (
    <FilterWrapper>
      <Input value={query} onInput={handleQueryInput} placeholder="Search for a name, phone" />
      <BrandSelect brand={brand} onSelect={setBrand} />
      <div className="flex items-center space-x-4 justify-end md:col-start-2 lg:col-start-auto">
        <Button type="button" onClick={resetFilters} variant="outline">
          <span>Reset</span>
          <CircleSlash />
        </Button>
        <Button type="submit" disabled={disableSubmit} onClick={handleQueryFormSubmit}>
          <span>Search</span>
          <Search />
        </Button>
      </div>
    </FilterWrapper>
  )
}

export default VendorFilters
