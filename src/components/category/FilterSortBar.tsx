'use client'

import { useState, useCallback } from 'react'

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name'
export type StockFilter = 'all' | 'in-stock' | 'out-of-stock'

interface FilterSortBarProps {
  productCount: number
  onSortChange: (sort: SortOption) => void
  onStockFilterChange: (filter: StockFilter) => void
  currentSort: SortOption
  currentStockFilter: StockFilter
}

export function FilterSortBar({
  productCount,
  onSortChange,
  onStockFilterChange,
  currentSort,
  currentStockFilter,
}: FilterSortBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name: A-Z' },
  ]

  const stockOptions: { value: StockFilter; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock Only' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ]

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOption)
  }, [onSortChange])

  const handleStockFilterChange = useCallback((filter: StockFilter) => {
    onStockFilterChange(filter)
    setIsFilterOpen(false)
  }, [onStockFilterChange])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border">
      {/* Product Count */}
      <p className="text-text-muted text-sm">
        Showing <span className="font-medium text-primary">{productCount}</span> product{productCount !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-4">
        {/* Stock Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors text-sm"
            aria-expanded={isFilterOpen}
            aria-haspopup="true"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
            {currentStockFilter !== 'all' && (
              <span className="w-2 h-2 bg-accent rounded-full" />
            )}
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-20">
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Availability
                  </p>
                  {stockOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStockFilterChange(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        currentStockFilter === option.value
                          ? 'bg-accent/10 text-accent font-medium'
                          : 'hover:bg-cream text-primary'
                      }`}
                    >
                      {option.label}
                      {currentStockFilter === option.value && (
                        <svg className="w-4 h-4 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-text-muted hidden sm:inline">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-border rounded-lg bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
