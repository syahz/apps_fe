export interface GuestBook {
  id: string
  name: string
  origin: string
  purpose: string
  selfie_image: string | null
  signature_image: string | null
  created_at: string | Date
  updated_at: string | Date
}

export interface GuestBookParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface GuestBookListResponse {
  guestbooks: GuestBook[]
  pagination: {
    totalData: number
    page: number
    limit: number
    totalPage: number
  }
}
