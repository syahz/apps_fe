'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { useDeletePublication } from '@/hooks/api/usePublication'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { EditPublicationForm } from '../forms/EditPublicationForm'

interface PublicationActionsCellProps {
  publicationId: string
  publicationTitle?: string
}

export function PublicationActionsCell({ publicationId, publicationTitle }: PublicationActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const deletePublication = useDeletePublication()

  const handleDeleteConfirm = () => {
    deletePublication.mutate(publicationId, {
      onSuccess: () => {
        toast.success(`Publikasi ${publicationTitle ?? `#${publicationId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Gagal menghapus publikasi')
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id: publicationId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-6xl w-[92vw]">
          <DialogHeader>
            <DialogTitle>Edit Publikasi</DialogTitle>
          </DialogHeader>
          {openEdit && <EditPublicationForm key={publicationId} publicationId={publicationId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {publicationTitle ?? `#${publicationId}`}?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Publikasi akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
