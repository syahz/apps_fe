'use client'

import { useMemo, useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { GuestBookTable } from '../components/table/GuestBookTable'
import { GuestBookColumns } from '../components/table/GuestBookColumns'
import { GuestBookSearchConfig } from '@/config/search-config'
import { useGetGuestBooks } from '@/hooks/api/useGuestBook'
import { GuestBookParams } from '@/types/api/guestBookType'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'

export default function GuestBookPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams: GuestBookParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch || undefined,
    sortBy: sorting.length ? sorting[0].id : undefined,
    sortOrder: sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : undefined
  }

  const { data, isLoading, isFetching, error } = useGetGuestBooks(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => GuestBookColumns, [])

  const table = useReactTable({
    data: data?.guestbooks || defaultData,
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
    manualSorting: true
  })

  useEffect(() => {
    const totalPages = data?.pagination?.totalPage
    if (totalPages && pageIndex >= totalPages) {
      table.setPageIndex(0)
    }
  }, [data?.pagination?.totalPage, pageIndex, table])

  return (
    <PageContainer title="Buku Tamu">
      <div className="flex w-full flex-col gap-2 py-4">
        <h2 className="text-xl font-semibold">Daftar Buku Tamu</h2>
        <p className="text-sm text-muted-foreground">Pantau dan kelola tamu yang tercatat pada sistem.</p>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={GuestBookSearchConfig}
        />

        <GuestBookTable table={table} isLoading={isLoading} isFetching={isFetching} error={error} />

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
