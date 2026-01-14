import * as z from 'zod'

export const CreateArticleCategoryValidation = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi')
})

export type CreateArticleCategoryFormValues = z.infer<typeof CreateArticleCategoryValidation>

export const UpdateArticleCategoryValidation = z.object({
  name: z.string().min(2, 'Nama minimal harus 2 karakter.').optional()
})

export type UpdateArticleCategoryFormValues = z.infer<typeof UpdateArticleCategoryValidation>
