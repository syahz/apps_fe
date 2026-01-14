'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as DayPicker } from '@/components/ui/calendar'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { format } from 'date-fns'
import { useCreatePublication } from '@/hooks/api/usePublication'
import { useGetAllArticleCategories } from '@/hooks/api/useArticleCategory'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CreatePublicationFormValues, CreatePublicationSchema } from '../validation/PublicationValidation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  formatFileSize,
  PUBLICATION_IMAGE_ACCEPT_ATTRIBUTE,
  PUBLICATION_IMAGE_ALLOWED_LABEL,
  PUBLICATION_IMAGE_MAX_LABEL,
  validatePublicationImageFile
} from '../../utils/imageHelpers'
import Image from 'next/image'

const PUBLICATION_TYPES = [
  { value: 'News', label: 'News' },
  { value: 'Article', label: 'Article' }
]

export function CreatePublicationForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const form = useForm<CreatePublicationFormValues>({
    resolver: zodResolver(CreatePublicationSchema),
    defaultValues: {
      title: '',
      content: '',
      date: new Date(),
      category_ids: [],
      type: 'Article',
      image: undefined
    }
  })

  const createPublication = useCreatePublication()
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllArticleCategories()
  const categories = categoriesData?.data || []

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const updatePreview = (file: File | null) => {
    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return file ? URL.createObjectURL(file) : null
    })
  }

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, onChange: (value: File | undefined) => void) => {
    const file = event.target.files?.[0]

    if (!file) {
      onChange(undefined)
      updatePreview(null)
      return
    }

    const validationMessage = validatePublicationImageFile(file)
    if (validationMessage) {
      toast.warning(validationMessage)
      resetFileInput()
      onChange(undefined)
      updatePreview(null)
      return
    }

    onChange(file)
    updatePreview(file)
  }

  const handleClearImage = (onChange: (value: File | undefined) => void) => {
    resetFileInput()
    onChange(undefined)
    updatePreview(null)
  }

  const onSubmit = (values: CreatePublicationFormValues) => {
    createPublication.mutate(values, {
      onSuccess: () => {
        toast.success('Publikasi berhasil dibuat!')
        router.push('/admin/publications')
      },
      onError: (error) => {
        const fallback = 'Gagal membuat publikasi'
        const msg = (() => {
          const raw = (error as { message?: string })?.message
          if (!raw) return fallback
          const maybeJson = raw.includes('{') ? raw.slice(raw.indexOf('{')) : ''
          if (maybeJson) {
            try {
              const parsed = JSON.parse(maybeJson)
              const issues = parsed?.issues || parsed
              if (Array.isArray(issues) && issues[0]?.message) {
                return issues[0].message as string
              }
            } catch (error) {
              console.error('Failed to parse Zod error message JSON', error)
            }
          }
          return raw.replace('Validation Error:', '').trim() || fallback
        })()

        toast.error(msg)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publikasi</CardTitle>
            <CardDescription>Lengkapi judul, tanggal, konten, gambar, tipe, dan kategori publikasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul publikasi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PUBLICATION_TYPES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Publikasi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), 'dd MMM yyyy') : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DayPicker mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date)} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      minHeightClass="min-h-[360px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar Publikasi</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept={PUBLICATION_IMAGE_ACCEPT_ATTRIBUTE}
                        name={field.name}
                        ref={(node) => {
                          field.ref(node)
                          fileInputRef.current = node
                        }}
                        disabled={createPublication.isPending}
                        onChange={(event) => handleFileChange(event, field.onChange)}
                      />

                      <div className="text-xs text-muted-foreground">
                        {field.value?.name ? (
                          <span>
                            {field.value.name} • {formatFileSize(field.value.size)}
                          </span>
                        ) : (
                          <span>Belum ada file dipilih</span>
                        )}
                      </div>

                      {imagePreview ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                          <Image
                            src={imagePreview}
                            alt="Pratinjau gambar publikasi"
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 640px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                          Pratinjau gambar akan muncul setelah Anda memilih file.
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearImage(field.onChange)}
                          disabled={createPublication.isPending || !field.value}
                        >
                          Hapus Pilihan
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Format {PUBLICATION_IMAGE_ALLOWED_LABEL}. Ukuran maksimal {PUBLICATION_IMAGE_MAX_LABEL}. OG image akan diproses otomatis oleh
                    sistem.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="category_ids"
              render={({ field }) => {
                const selected = categories.filter((cat) => field.value?.includes(String(cat.id)))

                return (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Kategori</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isLoadingCategories}
                          className={cn('w-full justify-between', !field.value?.length && 'text-muted-foreground')}
                        >
                          <span className="truncate">{selected.length > 0 ? selected.map((cat) => cat.name).join(', ') : 'Pilih kategori'}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Cari kategori..." />
                          <CommandList>
                            <CommandEmpty>Tidak ada kategori</CommandEmpty>
                            <CommandGroup>
                              {categories.map((cat) => {
                                const value = String(cat.id)
                                const isSelected = field.value?.includes(value)

                                return (
                                  <CommandItem
                                    key={cat.id}
                                    value={cat.name}
                                    onSelect={() => {
                                      const next = isSelected ? field.value.filter((id) => id !== value) : [...(field.value || []), value]
                                      field.onChange(next)
                                    }}
                                  >
                                    <Checkbox checked={isSelected} className="mr-2" />
                                    <span>{cat.name}</span>
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={createPublication.isPending}>
              {createPublication.isPending ? 'Menyimpan...' : 'Simpan Publikasi'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
