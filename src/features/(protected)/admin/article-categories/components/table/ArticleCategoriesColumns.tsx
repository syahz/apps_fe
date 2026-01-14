'use client'

import { ArticleCategory } from '@/types/api/articleCategoryType'
import { Button } from '@/components/ui/button'
import { ArticleCategoriesActionsCell } from './ArticleCategoriesActionsCell'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

export const ArticleCategoriesColumns: ColumnDef<ArticleCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Kategori
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[250px]' }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original
      return <ArticleCategoriesActionsCell categoryId={id} categoryName={name} />
    },
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' }
  }
]
