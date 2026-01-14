'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { useDeleteArticleCategory } from '@/hooks/api/useArticleCategory'
import { toast } from 'sonner'
import { useState } from 'react'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { EditArticleCategoryForm } from '@/features/(protected)/admin/article-categories/components/forms/EditArticleCategoryForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ArticleCategoriesActionsCellProps {
  categoryId: string
  categoryName?: string
}

export function ArticleCategoriesActionsCell({ categoryId, categoryName }: ArticleCategoriesActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const deleteCategory = useDeleteArticleCategory()

  const handleDeleteConfirm = () => {
    deleteCategory.mutateAsync(categoryId, {
      onSuccess: () => {
        toast.success(`Kategori ${categoryName ?? `#${categoryId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal menghapus kategori artikel'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id: categoryId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori Artikel</DialogTitle>
          </DialogHeader>
          {openEdit && <EditArticleCategoryForm key={categoryId} categoryId={categoryId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {categoryName ?? `#${categoryId}`}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data kategori akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
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
