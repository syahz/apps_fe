import * as z from 'zod'

export const PUBLICATION_MAX_IMAGE_SIZE = 3 * 1024 * 1024 // 3 MB
export const PUBLICATION_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'] as const

const PublicationSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  date: z.date({ message: 'Tanggal tidak valid atau wajib diisi' }),
  category_ids: z.array(z.string().min(1)).min(1, 'Pilih minimal satu kategori'),
  type: z.enum(['News', 'Article'], { message: 'Pilih tipe publikasi' })
})

const requiredImageSchema = z
  .custom<File>((file) => file instanceof File, {
    message: 'Gambar publikasi wajib diunggah'
  })
  .refine((file) => file.size <= PUBLICATION_MAX_IMAGE_SIZE, {
    message: 'Ukuran gambar maksimal 3 MB'
  })
  .refine((file) => PUBLICATION_ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: 'Format gambar harus JPG, JPEG, PNG, atau WEBP'
  })

const optionalImageSchema = z
  .custom<File | null | undefined>((file) => file === undefined || file === null || file instanceof File, {
    message: 'File gambar tidak valid'
  })
  .refine((file) => !file || file.size <= PUBLICATION_MAX_IMAGE_SIZE, {
    message: 'Ukuran gambar maksimal 3 MB'
  })
  .refine((file) => !file || PUBLICATION_ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: 'Format gambar harus JPG, JPEG, PNG, atau WEBP'
  })
  .optional()
  .nullable()

export const CreatePublicationSchema = PublicationSchema.extend({
  image: requiredImageSchema
})
export type CreatePublicationFormValues = z.infer<typeof CreatePublicationSchema>

export const UpdatePublicationSchema = PublicationSchema.extend({
  image: optionalImageSchema
})
export type UpdatePublicationFormValues = z.infer<typeof UpdatePublicationSchema>
