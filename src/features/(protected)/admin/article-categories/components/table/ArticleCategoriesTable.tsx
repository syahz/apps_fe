'use client'

import { DataTable } from '@/components/table/DataTable'
import { ArticleCategory } from '@/types/api/articleCategoryType'
import { Table } from '@tanstack/react-table'

interface ArticleCategoriesTableProps {
  table: Table<ArticleCategory>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function ArticleCategoriesTable({ table, isLoading, isFetching, error }: ArticleCategoriesTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada kategori artikel untuk saat ini."
      errorMessage="Gagal memuat data kategori artikel. Silakan coba lagi."
    />
  )
}
