import { PUBLICATION_ACCEPTED_IMAGE_TYPES, PUBLICATION_MAX_IMAGE_SIZE } from '../components/validation/PublicationValidation'

const BYTES_IN_KB = 1024
const BYTES_IN_MB = BYTES_IN_KB * 1024

export const PUBLICATION_IMAGE_ACCEPT_ATTRIBUTE = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
export const PUBLICATION_IMAGE_ALLOWED_LABEL = 'JPG, JPEG, PNG, atau WEBP'
export const PUBLICATION_IMAGE_MAX_LABEL = `${(PUBLICATION_MAX_IMAGE_SIZE / BYTES_IN_MB).toFixed(0)} MB`

export const formatFileSize = (bytes: number) => {
  if (!bytes || bytes < 0) return '0 KB'
  if (bytes >= BYTES_IN_MB) {
    return `${(bytes / BYTES_IN_MB).toFixed(2)} MB`
  }
  return `${(bytes / BYTES_IN_KB).toFixed(2)} KB`
}

export const validatePublicationImageFile = (file: File): string | null => {
  if (file.size > PUBLICATION_MAX_IMAGE_SIZE) {
    return `Ukuran gambar maksimal ${PUBLICATION_IMAGE_MAX_LABEL}`
  }

  if (!PUBLICATION_ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof PUBLICATION_ACCEPTED_IMAGE_TYPES)[number])) {
    return `Format gambar harus ${PUBLICATION_IMAGE_ALLOWED_LABEL}`
  }

  return null
}
