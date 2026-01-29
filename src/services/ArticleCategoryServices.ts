import axiosInstance from '@/lib/axios'
import { ArticleCategory, ArticleCategoryParams, CreateArticleCategoryRequest, UpdateArticleCategoryRequest } from '@/types/api/articleCategoryType'
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiError, ApiResponse, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'

const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.errors || defaultMsg,
      code: err.response?.data?.code || defaultCode,
      details: err.response?.data?.details
    }
  }
  return {
    message: defaultMsg,
    code: defaultCode,
    details: undefined
  }
}

export const getArticleCategories = async (params: ArticleCategoryParams = {}): Promise<PaginatedResponse<ArticleCategory>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)

    const response = await axiosInstance.get<RawPaginatedResponse<ArticleCategory>>(`/admin/categories?${searchParams.toString()}`)
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil data kategori artikel', 'GET_ARTICLE_CATEGORIES_ERROR')
  }
}

export const getAllArticleCategories = async (): Promise<ApiResponse<ArticleCategory[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ArticleCategory[]>>('/admin/categories/all')
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil semua kategori artikel', 'GET_ALL_ARTICLE_CATEGORIES_ERROR')
  }
}

export const getArticleCategoryById = async (id: string): Promise<ArticleCategory> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ArticleCategory>>(`/admin/categories/${id}`)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil detail kategori artikel', 'GET_ARTICLE_CATEGORY_BY_ID_ERROR')
  }
}

export const createArticleCategory = async (data: CreateArticleCategoryRequest): Promise<ArticleCategory> => {
  try {
    const response = await axiosInstance.post<ApiResponse<ArticleCategory>>('/admin/categories', data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal membuat kategori artikel baru', 'CREATE_ARTICLE_CATEGORY_ERROR')
  }
}

export const updateArticleCategory = async (id: string, data: UpdateArticleCategoryRequest): Promise<ArticleCategory> => {
  try {
    const response = await axiosInstance.put<ApiResponse<ArticleCategory>>(`/admin/categories/${id}`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui kategori artikel', 'UPDATE_ARTICLE_CATEGORY_ERROR')
  }
}

export const deleteArticleCategory = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/article-categories/${id}`)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal menghapus kategori artikel', 'DELETE_ARTICLE_CATEGORY_ERROR')
  }
}
