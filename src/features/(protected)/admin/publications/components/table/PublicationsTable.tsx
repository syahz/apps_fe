'use client'

import { Publication } from '@/types/api/publicationType'
import { DataTable } from '@/components/table/DataTable'
import { Table } from '@tanstack/react-table'

interface PublicationsTableProps {
  table: Table<Publication>
  isLoading: boolean
  isFetching: boolean
  error?: unknown
}

export function PublicationsTable({ table, isLoading, isFetching, error }: PublicationsTableProps) {
  const normalizedError = error
    ? error instanceof Error
      ? error
      : ({ message: (error as { message?: string }).message ?? 'Terjadi kesalahan.' } as Error)
    : null
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={normalizedError}
      emptyMessage="Tidak ada publikasi untuk saat ini."
      errorMessage="Gagal memuat data publikasi. Silakan coba lagi."
    />
  )
}
