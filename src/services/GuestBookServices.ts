import axiosInstance from '@/lib/axios'
import type { ApiError, ApiResponse } from '@/types/api/api'
import { GuestBook, GuestBookListResponse, GuestBookParams } from '@/types/api/guestBookType'

const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.errors || defaultMsg,
      code: err.response?.data?.code || defaultCode,
      details: err.response?.data?.details
    }
  }
  return { message: defaultMsg, code: defaultCode }
}

const buildSearchParams = (params: GuestBookParams = {}) => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return searchParams
}

export const getGuestBooks = async (params: GuestBookParams = {}): Promise<GuestBookListResponse> => {
  try {
    const searchParams = buildSearchParams(params)
    const response = await axiosInstance.get<ApiResponse<GuestBookListResponse>>(`/admin/guestbook?${searchParams.toString()}`)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil data buku tamu', 'GET_GUESTBOOKS_ERROR')
  }
}

export const getGuestBookById = async (id: string): Promise<GuestBook> => {
  try {
    const response = await axiosInstance.get<ApiResponse<GuestBook>>(`/admin/guestbook/${id}`)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil detail buku tamu', 'GET_GUESTBOOK_BY_ID_ERROR')
  }
}

export const deleteGuestBook = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/guestbook/${id}`)
  } catch (error) {
    throw normalizeError(error, 'Gagal menghapus data buku tamu', 'DELETE_GUESTBOOK_ERROR')
  }
}
