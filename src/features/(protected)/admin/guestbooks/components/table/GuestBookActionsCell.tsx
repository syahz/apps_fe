'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useDeleteGuestBook } from '@/hooks/api/useGuestBook'

interface GuestBookActionsCellProps {
  guestbookId: string
  guestName: string
}

export function GuestBookActionsCell({ guestbookId, guestName }: GuestBookActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const deleteGuestBook = useDeleteGuestBook()

  const handleDelete = () => {
    deleteGuestBook.mutate(guestbookId, {
      onSuccess: () => {
        toast.success(`Data tamu ${guestName || `#${guestbookId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Gagal menghapus data tamu')
      }
    })
  }

  return (
    <>
      <div className="flex gap-2">
        <Link href={`/admin/guestbooks/${guestbookId}`}>
          <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Lihat detail tamu">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpenDelete(true)}
          aria-label="Hapus tamu"
          disabled={deleteGuestBook.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tamu?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data tamu {guestName || `#${guestbookId}`}. Proses ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deleteGuestBook.isPending}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
