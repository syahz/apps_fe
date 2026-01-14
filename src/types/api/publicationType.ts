import type { PaginatedResponse } from '@/types/api/api'

export type PublicationType = 'News' | 'Article'

export interface PublicationCategoryRef {
  id: string
  name: string
}

export interface Publication {
  id: string
  slug: string
  title: string
  content: string
  date: string | Date
  created_at: string | Date
  updated_at: string | Date
  language: 'id' | 'en'
  type: PublicationType
  category_ids?: string[]
  categories?: PublicationCategoryRef[]
  image?: string | null
  image_og?: string | null
}

export interface PublicationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  lang?: 'id' | 'en'
  type?: PublicationType
}

export type PublicationListResponse = PaginatedResponse<Publication>

export interface CreatePublicationRequest {
  title: string
  content: string
  date: string | Date
  category_ids: string[]
  type: PublicationType
  image: File
}

export interface UpdatePublicationRequest {
  title?: string
  content?: string
  date?: string | Date
  category_ids?: string[]
  type?: PublicationType
  image?: File | null
}

export type PublicationCreatePayload = CreatePublicationRequest

export type PublicationUpdatePayload = UpdatePublicationRequest

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PublicationCreateOrUpdateResponse extends Publication {}

export type PublicationDetail = Publication
