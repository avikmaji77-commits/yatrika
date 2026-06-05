/**
 * API Service Module
 * 
 * This module provides functions to interact with the Yatrika backend API.
 * The API base URL is configured in vite.config.ts with proxy to http://localhost:5000
 * 
 * Usage:
 *   import { getDestinations, getTrending } from '@/lib/api-service'
 *   const destinations = await getDestinations({ limit: 10 })
 */

const API_BASE = '/api'

export interface FilterParams {
  category?: string
  budget?: string
  season?: string
  search?: string
  min_rating?: number
  max_rating?: number
  limit?: number
  offset?: number
}

export interface Destination {
  id: number
  name: string
  location: string
  category: string
  budget: string
  season: string
  rating: number
  description?: string
  image_url?: string
  [key: string]: any
}

export interface ApiResponse<T> {
  data?: T
  results?: T
  total?: number
  status?: string
  error?: string
  message?: string
}

/**
 * Fetch destinations with optional filters
 * 
 * @param filters - Filter parameters
 * @returns Promise<ApiResponse<Destination[]>>
 */
export async function getDestinations(filters?: FilterParams) {
  try {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.category) params.append('category', filters.category)
      if (filters.budget) params.append('budget', filters.budget)
      if (filters.season) params.append('season', filters.season)
      if (filters.search) params.append('search', filters.search)
      if (filters.min_rating !== undefined) params.append('min_rating', String(filters.min_rating))
      if (filters.max_rating !== undefined) params.append('max_rating', String(filters.max_rating))
      if (filters.limit !== undefined) params.append('limit', String(filters.limit))
      if (filters.offset !== undefined) params.append('offset', String(filters.offset))
    }
    
    const queryString = params.toString()
    const url = queryString ? `${API_BASE}/destinations?${queryString}` : `${API_BASE}/destinations`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching destinations:', error)
    throw error
  }
}

/**
 * Fetch a specific destination by ID
 * 
 * @param id - Destination ID
 * @returns Promise<Destination>
 */
export async function getDestination(id: number) {
  try {
    const response = await fetch(`${API_BASE}/destinations/${id}`)
    
    if (!response.ok) {
      throw new Error(`Destination not found: ${id}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching destination:', error)
    throw error
  }
}

/**
 * Get trending destinations
 * 
 * @returns Promise<ApiResponse<Destination[]>>
 */
export async function getTrending() {
  try {
    const response = await fetch(`${API_BASE}/trending`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching trending:', error)
    throw error
  }
}

/**
 * Get API metadata (categories, seasons, budgets)
 * 
 * @returns Promise<ApiResponse>
 */
export async function getMeta() {
  try {
    const response = await fetch(`${API_BASE}/meta`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw error
  }
}

/**
 * Get statistics
 * 
 * @returns Promise<ApiResponse>
 */
export async function getStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}

/**
 * Get recommendations based on preferences
 * 
 * @param preferences - User preferences
 * @returns Promise<ApiResponse>
 */
export async function getRecommendations(preferences: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting recommendations:', error)
    throw error
  }
}

/**
 * Search destinations
 * 
 * @param query - Search query
 * @returns Promise<ApiResponse>
 */
export async function searchDestinations(query: string) {
  try {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error searching destinations:', error)
    throw error
  }
}

/**
 * Chat with AI assistant
 * 
 * @param message - User message
 * @returns Promise<ApiResponse>
 */
export async function chat(message: string) {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error in chat:', error)
    throw error
  }
}

/**
 * Auth: login returns token and user
 */
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error(`Auth failed: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function getProfile(token: string) {
  try {
    const response = await fetch(`${API_BASE}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error(`Profile fetch failed: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Profile error:', error)
    throw error
  }
}

export async function getWishlist(token: string) {
  try {
    const response = await fetch(`${API_BASE}/user/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error(`Wishlist fetch failed: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Wishlist error:', error)
    throw error
  }
}

export async function addToWishlist(token: string, item: string) {
  try {
    const response = await fetch(`${API_BASE}/user/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item }),
    })
    if (!response.ok) throw new Error(`Wishlist add failed: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Add wishlist error:', error)
    throw error
  }
}

export async function removeFromWishlist(token: string, item: string) {
  try {
    const response = await fetch(`${API_BASE}/user/wishlist`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item }),
    })
    if (!response.ok) throw new Error(`Wishlist remove failed: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Remove wishlist error:', error)
    throw error
  }
}

/**
 * Check backend health
 * 
 * @returns Promise<boolean>
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch('/health', { signal: AbortSignal.timeout(3000) })
    return response.ok
  } catch (error) {
    console.warn('Backend health check failed:', error)
    return false
  }
}

export default {
  getDestinations,
  getDestination,
  getTrending,
  getMeta,
  getStats,
  getRecommendations,
  searchDestinations,
  chat,
  checkHealth,
}
