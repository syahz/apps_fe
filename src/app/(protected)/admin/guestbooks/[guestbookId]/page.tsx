import GuestBookDetailPage from '@/features/(protected)/admin/guestbooks/page/Detail'
import { notFound } from 'next/navigation'

type GuestBookDetailRouteProps = {
  params?: Promise<{ guestbookId?: string }>
}

export default async function GuestBookDetailRoute({ params }: GuestBookDetailRouteProps) {
  const resolvedParams = (await params) ?? {}
  const guestbookId = resolvedParams.guestbookId

  if (!guestbookId) {
    notFound()
  }

  return <GuestBookDetailPage guestbookId={guestbookId} />
}
