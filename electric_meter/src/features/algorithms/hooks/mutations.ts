import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { Algorithm } from './queries'

export interface CreateAlgorithmParams {
  name: string
  description: string
  algorithm_type: string
  script: string
}

export interface UpdateAlgorithmParams extends CreateAlgorithmParams {
  id: string
}

// Hook to create a new algorithm
export const useCreateAlgorithm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateAlgorithmParams): Promise<Algorithm> => {
      const response = await api.post<Algorithm>('/algorithms', params as unknown as Record<string, string | number | boolean | object>)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch algorithms list
      queryClient.invalidateQueries({ queryKey: ['algorithms'] })
    }
  })
}

// Hook to update an existing algorithm
export const useUpdateAlgorithm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: UpdateAlgorithmParams): Promise<Algorithm> => {
      const { id, ...updateData } = params
      const response = await api.put<Algorithm>(`/algorithms/${id}`, updateData as unknown as Record<string, string | number | boolean | object>)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch algorithms list
      queryClient.invalidateQueries({ queryKey: ['algorithms'] })
      // Invalidate specific algorithm query
      queryClient.invalidateQueries({ queryKey: ['algorithm', data.id] })
    }
  })
}

// Hook to delete an algorithm
export const useDeleteAlgorithm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/algorithms/${id}`)
    },
    onSuccess: () => {
      // Invalidate and refetch algorithms list
      queryClient.invalidateQueries({ queryKey: ['algorithms'] })
    }
  })
}
