'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/types/api/api'
import {
  PublicationCreateOrUpdateResponse,
  PublicationCreatePayload,
  PublicationListResponse,
  PublicationParams,
  PublicationUpdatePayload,
  PublicationDetail
} from '@/types/api/publicationType'
import { createPublication, deletePublication, getPublicationById, getPublications, updatePublication } from '@/services/PublicationServices'

export function useGetPublications(params: PublicationParams = {}) {
  return useQuery<PublicationListResponse, ApiError>({
    queryKey: ['publications', params],
    queryFn: () => getPublications(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) return false
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

export function useGetPublicationById(publicationId: string) {
  return useQuery<PublicationDetail, ApiError>({
    queryKey: ['publications', publicationId],
    queryFn: () => getPublicationById(publicationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!publicationId,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) return false
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

export function useCreatePublication() {
  const queryClient = useQueryClient()
  return useMutation<PublicationCreateOrUpdateResponse, ApiError, PublicationCreatePayload>({
    mutationFn: (payload) => createPublication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] })
    }
  })
}

export function useUpdatePublication(publicationId: string) {
  const queryClient = useQueryClient()
  return useMutation<PublicationCreateOrUpdateResponse, ApiError, PublicationUpdatePayload>({
    mutationFn: (payload) => updatePublication(publicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] })
      queryClient.invalidateQueries({ queryKey: ['publications', publicationId] })
    }
  })
}

export function useDeletePublication() {
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, string>({
    mutationFn: (publicationId) => deletePublication(publicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] })
    }
  })
}
