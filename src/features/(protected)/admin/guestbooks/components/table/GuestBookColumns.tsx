'use client'

import { ColumnDef } from '@tanstack/react-table'
import { GuestBook } from '@/types/api/guestBookType'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { GuestBookActionsCell } from './GuestBookActionsCell'
import { format } from 'date-fns'

const formatDate = (value?: string | Date | null) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'dd MMM yyyy HH:mm')
}

export const GuestBookColumns: ColumnDef<GuestBook>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    meta: { exportLabel: 'Nama' }
  },
  {
    accessorKey: 'origin',
    header: 'Asal Instansi',
    cell: ({ row }) => <span>{row.original.origin}</span>,
    meta: { exportLabel: 'Asal Instansi' }
  },
  {
    accessorKey: 'purpose',
    header: 'Keperluan',
    cell: ({ row }) => <span className="line-clamp-2 max-w-[320px] text-sm text-muted-foreground">{row.original.purpose}</span>,
    enableSorting: false,
    meta: { exportLabel: 'Keperluan' }
  },
  {
    accessorKey: 'created_at',
    header: 'Waktu Masuk',
    cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
    meta: {
      exportLabel: 'Waktu Masuk',
      exportValue: (guestbook: GuestBook) => formatDate(guestbook.created_at)
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Terakhir Diubah',
    cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.updated_at)}</span>,
    meta: {
      exportLabel: 'Terakhir Diubah',
      exportValue: (guestbook: GuestBook) => formatDate(guestbook.updated_at)
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <GuestBookActionsCell guestbookId={row.original.id} guestName={row.original.name} />,
    meta: { exportable: false }
  }
]
