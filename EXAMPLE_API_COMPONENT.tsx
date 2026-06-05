/**
 * Example Component: Destinations List with API Integration
 * 
 * This component demonstrates how to fetch and display destinations from the backend API.
 * Replace the hardcoded data in your existing components with these patterns.
 * 
 * Copy this pattern to update other components to use the real API.
 */

import React, { useEffect, useState } from "react"
import { getDestinations, getMeta } from "@/lib/api-service"
import type { Destination, FilterParams } from "@/lib/api-service"

interface DestinationsListProps {
  limit?: number
}

export function DestinationsListExample(props: DestinationsListProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterParams>({
    limit: props.limit || 10,
  })
  const [categories, setCategories] = useState<string[]>([])
  const [seasons, setSeasons] = useState<string[]>([])

  // Fetch metadata (categories, seasons) on mount
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const meta = await getMeta()
        if (meta.categories) setCategories(meta.categories)
        if (meta.seasons) setSeasons(meta.seasons)
      } catch (err) {
        console.warn("Could not load metadata:", err)
      }
    }
    
    fetchMeta()
  }, [])

  // Fetch destinations when filters change
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await getDestinations(filters)
        
        if (response.data) {
          setDestinations(response.data)
        } else if (Array.isArray(response)) {
          setDestinations(response)
        } else {
          console.warn("Unexpected response format:", response)
          setDestinations([])
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load destinations"
        setError(message)
        console.error("Error fetching destinations:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDestinations()
  }, [filters])

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }))
  }

  const handleSearch = (query: string) => {
    handleFilterChange({ search: query || undefined })
  }

  const handleCategoryChange = (category: string) => {
    handleFilterChange({ category: category || undefined })
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search destinations..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Season Filter */}
          {seasons.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Season</label>
              <select
                onChange={(e) => handleFilterChange({ season: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Seasons</option>
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading destinations...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p><strong>Error:</strong> {error}</p>
          <p className="text-sm mt-2">Make sure the backend is running on http://localhost:5000</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && destinations.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600">No destinations found</p>
        </div>
      )}

      {/* Destinations Grid */}
      {!loading && destinations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Placeholder */}
              {destination.image_url ? (
                <img
                  src={destination.image_url}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{destination.name}</h3>
                
                <p className="text-sm text-gray-600 mb-2">
                  📍 {destination.location}
                </p>

                {destination.category && (
                  <p className="text-sm text-blue-600 mb-2">
                    Category: {destination.category}
                  </p>
                )}

                {destination.rating !== undefined && (
                  <p className="text-sm text-yellow-600 mb-2">
                    ⭐ Rating: {destination.rating}/5
                  </p>
                )}

                {destination.budget && (
                  <p className="text-sm text-green-600 mb-2">
                    Budget: {destination.budget}
                  </p>
                )}

                {destination.season && (
                  <p className="text-sm text-purple-600">
                    Season: {destination.season}
                  </p>
                )}

                {destination.description && (
                  <p className="text-sm text-gray-700 mt-3">
                    {destination.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && destinations.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>Showing {destinations.length} results</p>
        </div>
      )}
    </div>
  )
}

export default DestinationsListExample
