'use client'

import { Table } from '@tanstack/react-table'
import { DataTable } from '@/components/table/DataTable'
import { GuestBook } from '@/types/api/guestBookType'

interface GuestBookTableProps {
  table: Table<GuestBook>
  isLoading: boolean
  isFetching: boolean
  error?: unknown
}

export function GuestBookTable({ table, isLoading, isFetching, error }: GuestBookTableProps) {
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
      emptyMessage="Belum ada data buku tamu."
      errorMessage="Gagal memuat data buku tamu."
      exportOptions={{ enabled: true, fileName: 'guestbook-data', scope: 'all' }}
    />
  )
}
