'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useGetArticleCategoryById, useUpdateArticleCategory } from '@/hooks/api/useArticleCategory'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateArticleCategoryFormValues, UpdateArticleCategoryValidation } from '../validation/ArticleCategoryValidation'

interface EditArticleCategoryFormProps {
  categoryId: string
  onSuccess?: () => void
}

export function EditArticleCategoryForm({ categoryId, onSuccess }: EditArticleCategoryFormProps) {
  const router = useRouter()
  const { data: categoryData, isLoading: isLoadingCategory } = useGetArticleCategoryById(categoryId)
  const updateCategory = useUpdateArticleCategory(categoryId)
  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateArticleCategoryFormValues>({
    resolver: zodResolver(UpdateArticleCategoryValidation),
    defaultValues: {
      name: ''
    }
  })

  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name
      })
      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [categoryData, form])

  if (isLoadingCategory || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateArticleCategoryFormValues) => {
    updateCategory.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Kategori artikel berhasil diperbarui!')
        router.push('/admin/article-categories')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui kategori artikel'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah Kategori Artikel</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mengubah kategori artikel.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Berita" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateCategory.isPending}>
              {updateCategory.isPending ? 'Menyimpan...' : 'Simpan Kategori'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
