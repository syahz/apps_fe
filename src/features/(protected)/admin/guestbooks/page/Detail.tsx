'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/PageContainer'
import { useGetGuestBookById } from '@/hooks/api/useGuestBook'
import { GuestBookDetailCard } from '../components/detail/GuestBookDetailCard'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

interface GuestBookDetailPageProps {
  guestbookId: string
}

export default function GuestBookDetailPage({ guestbookId }: GuestBookDetailPageProps) {
  const { data, isLoading, error } = useGetGuestBookById(guestbookId)

  return (
    <PageContainer title="Detail Buku Tamu">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Detail Buku Tamu</h2>
          <p className="text-sm text-muted-foreground">Lihat informasi lengkap tamu yang tercatat.</p>
        </div>
        <Link href="/admin/guestbooks">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="py-10">
          <DynamicSkeleton variant="pageForm" itemCount={3} />
        </div>
      )}

      {!isLoading && error && (
        <Card>
          <CardHeader>
            <CardTitle>Gagal memuat detail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error.message || 'Terjadi kesalahan saat mengambil data tamu.'}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && data && <GuestBookDetailCard guestbook={data} />}
    </PageContainer>
  )
}
