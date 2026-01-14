'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { PlusCircle } from 'lucide-react'
import { useGetPublications } from '@/hooks/api/usePublication'
import { PublicationParams } from '@/types/api/publicationType'
import { PublicationSearchConfig } from '@/config/search-config'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useMemo, useState } from 'react'
import { PublicationsTable } from '../components/table/PublicationsTable'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { PublicationsColumns } from '../components/table/PublicationsColumns'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'

export default function PublicationsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({
    lang: 'id'
  })

  const language = filters.lang ? (filters.lang as PublicationParams['lang']) : undefined

  const queryParams: PublicationParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
    lang: language
  }

  const { data, isLoading, error, isFetching } = useGetPublications(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => PublicationsColumns, [])

  const table = useReactTable({
    data: data?.items || defaultData,
    columns,
    pageCount: data?.pagination?.totalPage ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true
  })

  React.useEffect(() => {
    const totalPages = data?.pagination?.totalPage
    if (totalPages && pageIndex >= totalPages) {
      table.setPageIndex(0)
    }
  }, [data?.pagination?.totalPage, pageIndex, table])

  return (
    <PageContainer title="Publikasi">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Publikasi</h2>
        <Link href={'/admin/publications/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Buat Publikasi</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onClearFilters={handleClearFilters}
          onFilterChange={handleFilterChange}
          config={PublicationSearchConfig}
        />

        <PublicationsTable table={table} isLoading={isLoading} isFetching={isFetching} error={error} />

        {data?.pagination && (
          <DataTablePagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPage}
            pageSize={data.pagination.limit}
            totalItems={data.pagination.totalData}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </div>
    </PageContainer>
  )
}
