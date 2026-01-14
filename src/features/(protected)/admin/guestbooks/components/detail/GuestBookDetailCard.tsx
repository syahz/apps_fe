'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GuestBook } from '@/types/api/guestBookType'
import { buildPublicAssetUrl } from '@/lib/utils'

interface GuestBookDetailCardProps {
  guestbook: GuestBook
}

const ImagePreview = ({ src, label }: { src: string | null; label: string }) => {
  const resolvedSrc = buildPublicAssetUrl(src)
  if (!resolvedSrc) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        {label} belum tersedia
      </div>
    )
  }

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted">
      <Image src={resolvedSrc} alt={label} fill unoptimized sizes="(max-width: 768px) 100vw, 400px" className="object-contain" />
    </div>
  )
}

export function GuestBookDetailCard({ guestbook }: GuestBookDetailCardProps) {
  const infoItems = [
    { label: 'Nama', value: guestbook.name },
    { label: 'Asal Instansi', value: guestbook.origin },
    { label: 'Keperluan', value: guestbook.purpose }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Buku Tamu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {infoItems.map((item) => (
            <div key={item.label} className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">{item.label}</dt>
              <dd className="text-base font-semibold text-foreground">{item.value || '-'}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Foto Selfie</p>
            <ImagePreview src={guestbook.selfie_image} label="Foto selfie" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tanda Tangan</p>
            <ImagePreview src={guestbook.signature_image} label="Tanda tangan" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
