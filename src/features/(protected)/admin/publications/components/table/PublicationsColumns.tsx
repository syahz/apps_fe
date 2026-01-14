'use client'

import { Button } from '@/components/ui/button'
import { Publication } from '@/types/api/publicationType'
import { PublicationActionsCell } from './PublicationActionsCell'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export const PublicationsColumns: ColumnDef<Publication>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Judul
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium line-clamp-2 max-w-[360px]">{row.original.title}</span>,
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[320px]' }
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>
  },
  {
    accessorKey: 'language',
    header: 'Bahasa',
    cell: ({ row }) => <Badge variant="outline">{row.original.language === 'id' ? 'Indonesia' : 'English'}</Badge>
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = row.original.date ? new Date(row.original.date) : undefined
      return <span>{date ? format(date, 'dd MMM yyyy') : '-'}</span>
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Diperbarui',
    cell: ({ row }) => {
      const date = row.original.updated_at ? new Date(row.original.updated_at) : undefined
      return <span className="text-muted-foreground">{date ? format(date, 'dd MMM yyyy') : '-'}</span>
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, title } = row.original
      return <PublicationActionsCell publicationId={id} publicationTitle={title} />
    },
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' }
  }
]
