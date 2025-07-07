import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/api'

export interface Algorithm {
  id: string
  name: string
  description: string
  algorithm_type: string
  script: string
}

// Hook to get all algorithms
export const useAlgorithms = () => {
  return useQuery({
    queryKey: ['algorithms'],
    queryFn: async (): Promise<Algorithm[]> => {
      const response = await api.get<Algorithm[]>('/algorithms')
      return response.data
    }
  })
}

// Hook to get a single algorithm by ID
export const useAlgorithm = (id: string) => {
  return useQuery({
    queryKey: ['algorithm', id],
    queryFn: async (): Promise<Algorithm> => {
      const response = await api.get<Algorithm>(`/algorithms/${id}`)
      return response.data
    },
    enabled: !!id
  })
}
