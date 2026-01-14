import axiosInstance from '@/lib/axios'
import {
  Publication,
  PublicationParams,
  PublicationCreatePayload,
  PublicationUpdatePayload,
  PublicationCreateOrUpdateResponse,
  PublicationDetail
} from '@/types/api/publicationType'
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
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

const toPublicationFormData = (payload: PublicationCreatePayload | PublicationUpdatePayload) => {
  const formData = new FormData()

  const appendIfDefined = (key: string, value?: string | Blob | null) => {
    if (value === undefined || value === null) return
    formData.append(key, value)
  }

  appendIfDefined('title', payload.title)
  appendIfDefined('content', payload.content)

  if (payload.date) {
    const normalizedDate = new Date(payload.date).toISOString()
    appendIfDefined('date', normalizedDate)
  }

  if (Array.isArray(payload.category_ids)) {
    payload.category_ids.forEach((id) => formData.append('category_ids[]', id))
  }

  appendIfDefined('type', payload.type)

  if (payload.image instanceof File) {
    formData.append('image', payload.image)
  }

  return formData
}

export const getPublications = async (params: PublicationParams = {}): Promise<PaginatedResponse<Publication>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    if (params.lang) searchParams.set('lang', params.lang)
    if (params.type) searchParams.set('type', params.type)

    const response = await axiosInstance.get<RawPaginatedResponse<Publication>>(`/admin/publications?${searchParams.toString()}`)
    return normalizePaginatedResponse<Publication>(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil data publikasi', 'GET_PUBLICATIONS_ERROR')
  }
}

export const getPublicationById = async (id: string): Promise<PublicationDetail> => {
  try {
    const response = await axiosInstance.get<ApiResponse<PublicationCreateOrUpdateResponse>>(`/admin/publications/${id}`)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil detail publikasi', 'GET_PUBLICATION_BY_ID_ERROR')
  }
}

export const createPublication = async (payload: PublicationCreatePayload): Promise<PublicationCreateOrUpdateResponse> => {
  try {
    const formData = toPublicationFormData(payload)
    const response = await axiosInstance.post<ApiResponse<PublicationCreateOrUpdateResponse>>('/admin/publications', formData)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal membuat publikasi', 'CREATE_PUBLICATION_ERROR')
  }
}

export const updatePublication = async (id: string, payload: PublicationUpdatePayload): Promise<PublicationCreateOrUpdateResponse> => {
  try {
    const formData = toPublicationFormData(payload)
    const response = await axiosInstance.put<ApiResponse<PublicationCreateOrUpdateResponse>>(`/admin/publications/${id}`, formData)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui publikasi', 'UPDATE_PUBLICATION_ERROR')
  }
}

export const deletePublication = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/publications/${id}`)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal menghapus publikasi', 'DELETE_PUBLICATION_ERROR')
  }
}
