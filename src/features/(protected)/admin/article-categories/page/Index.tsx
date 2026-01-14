'use client'

import { Button } from '@/components/ui/button'
import { useGetArticleCategories } from '@/hooks/api/useArticleCategory'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { ArticleCategorySearchConfig } from '@/config/search-config'
import { ArticleCategoriesTable } from '../components/table/ArticleCategoriesTable'
import { PlusCircle } from 'lucide-react'
import { ArticleCategoriesColumns } from '../components/table/ArticleCategoriesColumns'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useState, useMemo } from 'react'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import Link from 'next/link'

export default function ArticleCategoriesPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder: sorting.length > 0 ? ((sorting[0].desc ? 'desc' : 'asc') as 'asc' | 'desc') : undefined
  }

  const { data, isLoading, error, isFetching } = useGetArticleCategories(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => ArticleCategoriesColumns, [])

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
    <PageContainer title="Kategori Artikel">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Kategori Artikel</h2>
        <Link href={'/admin/article-categories/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah Kategori</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={ArticleCategorySearchConfig}
        />

        <ArticleCategoriesTable table={table} isLoading={isLoading} isFetching={isFetching} error={error} />

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
