'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/types/api/api'
import type { GuestBook, GuestBookListResponse, GuestBookParams } from '@/types/api/guestBookType'
import { deleteGuestBook, getGuestBookById, getGuestBooks } from '@/services/GuestBookServices'

export function useGetGuestBooks(params: GuestBookParams = {}) {
  return useQuery<GuestBookListResponse, ApiError>({
    queryKey: ['guestbooks', params],
    queryFn: () => getGuestBooks(params),
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

export function useGetGuestBookById(guestbookId: string) {
  return useQuery<GuestBook, ApiError>({
    queryKey: ['guestbooks', guestbookId],
    queryFn: () => getGuestBookById(guestbookId),
    enabled: !!guestbookId,
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

export function useDeleteGuestBook() {
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, string>({
    mutationFn: (guestbookId) => deleteGuestBook(guestbookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestbooks'] })
    }
  })
}
