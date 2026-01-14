'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useCreateArticleCategory } from '@/hooks/api/useArticleCategory'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateArticleCategoryFormValues, CreateArticleCategoryValidation } from '../validation/ArticleCategoryValidation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateArticleCategoryForm() {
  const router = useRouter()
  const form = useForm<CreateArticleCategoryFormValues>({
    resolver: zodResolver(CreateArticleCategoryValidation),
    defaultValues: {
      name: ''
    }
  })

  const createCategory = useCreateArticleCategory()

  const onSubmit = (values: CreateArticleCategoryFormValues) => {
    createCategory.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Kategori artikel berhasil dibuat!')
        router.push('/admin/article-categories')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal membuat kategori artikel')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Kategori Artikel</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mendaftarkan kategori artikel baru.</CardDescription>
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
            <Button type="submit" disabled={createCategory.isPending}>
              {createCategory.isPending ? 'Menyimpan...' : 'Simpan Kategori'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
