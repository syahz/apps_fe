import type { PaginatedResponse } from '@/types/api/api'

export interface ArticleCategory {
  id: string
  name: string
}

export interface ArticleCategoryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateArticleCategoryRequest {
  name: string
}

export interface UpdateArticleCategoryRequest {
  name?: string
}

export type ArticleCategoryResponse = PaginatedResponse<ArticleCategory>
