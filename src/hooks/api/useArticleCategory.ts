'use client'

import { ApiError } from '@/types/api/api'
import { ArticleCategoryParams, CreateArticleCategoryRequest, UpdateArticleCategoryRequest } from '@/types/api/articleCategoryType'
import {
  getArticleCategories,
  getAllArticleCategories,
  createArticleCategory,
  deleteArticleCategory,
  getArticleCategoryById,
  updateArticleCategory
} from '@/services/ArticleCategoryServices'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetArticleCategories(params: ArticleCategoryParams = {}) {
  return useQuery({
    queryKey: ['article-categories', params],
    queryFn: () => getArticleCategories(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

export function useGetAllArticleCategories() {
  return useQuery({
    queryKey: ['article-categories', 'all'],
    queryFn: () => getAllArticleCategories(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

export function useGetArticleCategoryById(categoryId: string) {
  return useQuery({
    queryKey: ['article-categories', categoryId],
    queryFn: () => getArticleCategoryById(categoryId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!categoryId,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

export function useCreateArticleCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateArticleCategoryRequest) => createArticleCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-categories'] })
    }
  })
}

export function useUpdateArticleCategory(categoryId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateArticleCategoryRequest) => updateArticleCategory(categoryId, data as UpdateArticleCategoryRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-categories'] })
      queryClient.invalidateQueries({ queryKey: ['article-categories', categoryId] })
    }
  })
}

export function useDeleteArticleCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteArticleCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-categories'] })
    }
  })
}
