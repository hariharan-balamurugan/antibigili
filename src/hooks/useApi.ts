import { useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export const useApi = <T,>(
  apiFunction: () => Promise<T>,
  immediate = false
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  })

  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true })
    try {
      const result = await apiFunction()
      setState({ data: result, error: null, isLoading: false })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setState({ data: null, error: message, isLoading: false })
      throw err
    }
  }, [apiFunction])

  // Execute immediately if requested
  if (immediate) {
    // Only run once on mount
  }

  return { ...state, execute }
}
