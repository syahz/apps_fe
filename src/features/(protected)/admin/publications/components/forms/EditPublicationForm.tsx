'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import Image from 'next/image'
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
import { Calendar, Loader2 } from 'lucide-react'
import { buildPublicAssetUrl, cn } from '@/lib/utils'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { format } from 'date-fns'
import { useGetPublicationById, useUpdatePublication } from '@/hooks/api/usePublication'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { useGetAllArticleCategories } from '@/hooks/api/useArticleCategory'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UpdatePublicationFormValues, UpdatePublicationSchema } from '../validation/PublicationValidation'
import type { PublicationType } from '@/types/api/publicationType'
import {
  formatFileSize,
  PUBLICATION_IMAGE_ACCEPT_ATTRIBUTE,
  PUBLICATION_IMAGE_ALLOWED_LABEL,
  PUBLICATION_IMAGE_MAX_LABEL,
  validatePublicationImageFile
} from '../../utils/imageHelpers'

const PUBLICATION_TYPES = [
  { value: 'News', label: 'News' },
  { value: 'Article', label: 'Article' }
]

interface EditPublicationFormProps {
  publicationId: string
  onSuccess?: () => void
}

export function EditPublicationForm({ publicationId, onSuccess }: EditPublicationFormProps) {
  const router = useRouter()
  const { data: publicationData, isLoading } = useGetPublicationById(publicationId)
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllArticleCategories()
  const updatePublication = useUpdatePublication(publicationId)
  const [isFormReady, setIsFormReady] = useState(false)
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const categories = categoriesData?.data || []
  const previewSrc = imagePreview || serverImageUrl

  const form = useForm<UpdatePublicationFormValues>({
    resolver: zodResolver(UpdatePublicationSchema),
    defaultValues: {
      title: '',
      content: '',
      date: new Date(),
      category_ids: [],
      type: 'Article',
      image: undefined
    }
  })

  useEffect(() => {
    if (publicationData) {
      const normalizeDate = (value: unknown) => (value ? new Date(value as string | number | Date) : undefined)
      const normalizeType = (value: unknown): PublicationType => {
        if (!value) return 'Article'
        const lower = String(value).toLowerCase()
        if (lower === 'news') return 'News'
        if (lower === 'article') return 'Article'
        return 'Article'
      }

      form.reset({
        title: publicationData.title ?? '',
        content: publicationData.content ?? '',
        date: normalizeDate(publicationData.date),
        category_ids: publicationData.category_ids?.map((id) => String(id)) || publicationData.categories?.map((cat) => String(cat.id)) || [],
        type: normalizeType(publicationData.type),
        image: undefined
      })
      const resolvedImage = buildPublicAssetUrl(publicationData.image)
      setServerImageUrl(resolvedImage)
      setImagePreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev)
        }
        return null
      })
      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [publicationData, form])

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, onChange: (value: File | null | undefined) => void) => {
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

  const handleClearImage = (onChange: (value: File | null | undefined) => void) => {
    resetFileInput()
    onChange(undefined)
    updatePreview(null)
  }

  if (isLoading || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdatePublicationFormValues) => {
    updatePublication.mutate(values, {
      onSuccess: () => {
        toast.success('Publikasi berhasil diperbarui!')
        router.push('/admin/publications')
        onSuccess?.()
      },
      onError: (error) => {
        const fallback = 'Gagal memperbarui publikasi'
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
        <div className="max-h-[80vh] overflow-y-auto pr-1">
          <Card>
            <CardHeader>
              <CardTitle>Edit Publikasi</CardTitle>
              <CardDescription>Perbarui judul, tanggal, konten, gambar, tipe, dan kategori publikasi.</CardDescription>
            </CardHeader>
            {updatePublication.isPending && (
              <div className="mx-6 -mt-2 mb-2 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium">Sedang auto-translate ke EN &amp; ZH</span>
                  <span className="text-xs text-primary/80">Perubahan akan diterapkan ke semua bahasa, mohon tunggu.</span>
                </div>
              </div>
            )}
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
                        <Button
                          variant="outline"
                          className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), 'dd MMM yyyy') : 'Pilih tanggal'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date)}
                        />
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
                          disabled={updatePublication.isPending}
                          onChange={(event) => handleFileChange(event, field.onChange)}
                        />

                        <div className="text-xs text-muted-foreground">
                          {field.value?.name ? (
                            <span>
                              {field.value.name} • {formatFileSize(field.value.size)}
                            </span>
                          ) : serverImageUrl ? (
                            <span>Menggunakan gambar yang sudah tersimpan</span>
                          ) : (
                            <span>Belum ada file dipilih</span>
                          )}
                        </div>

                        {previewSrc ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={previewSrc}
                              alt="Pratinjau gambar publikasi"
                              fill
                              unoptimized
                              sizes="(max-width: 768px) 100vw, 640px"
                              className="object-cover"
                            />
                            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                              {imagePreview ? 'Gambar baru' : 'Gambar tersimpan'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                            Belum ada gambar tersimpan untuk publikasi ini.
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleClearImage(field.onChange)}
                            disabled={updatePublication.isPending || (!field.value && !imagePreview)}
                          >
                            Batalkan Pilihan Baru
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Format {PUBLICATION_IMAGE_ALLOWED_LABEL}. Ukuran maksimal {PUBLICATION_IMAGE_MAX_LABEL}. Jika tidak memilih file, gambar saat
                      ini akan dipertahankan dan OG image akan diperbarui otomatis oleh backend.
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
              <Button type="submit" disabled={updatePublication.isPending}>
                {updatePublication.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
