'use client'

import * as React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3 } from 'lucide-react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface DataTableRow {
  id: number | string
}

interface DataTableProps<TData extends DataTableRow> {
  data: TData[]
  columns: ColumnDef<TData>[]
  loading?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnVisibility?: boolean
  pagination?: {
    skip: number
    take: number
    total: number
    totalPages?: number
    onPageChange: (skip: number) => void
    onPageSizeChange?: (take: number) => void
  }
  emptyMessage?: string
  searchPlaceholder?: string
  className?: string
  showRowNumbers?: boolean
  stickyHeader?: boolean
  headerActions?: React.ReactNode
}

export const DataTable = <TData extends DataTableRow>({
  data: initialData,
  columns: initialColumns,
  loading = false,
  enableSorting = true,
  enableFiltering = false,
  enableColumnVisibility = true,
  pagination,
  emptyMessage = 'No results found.',
  className,
  showRowNumbers = false,
  stickyHeader = false,
  headerActions
}: DataTableProps<TData>) => {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  // Determine if we're using server-side pagination
  const isServerSidePagination = !!pagination

  const columns = React.useMemo(() => {
    const cols: ColumnDef<TData>[] = []

    if (showRowNumbers) {
      cols.push({
        id: 'rowNumber',
        header: () => <div className='text-center'>No</div>,
        cell: ({ row }: { row: Row<TData> }) => {
          if (isServerSidePagination) {
            return <div className='text-center'>{pagination.skip + row.index + 1}</div>
          } else {
            return <div className='text-center'>{row.index + 1}</div>
          }
        },
        enableSorting: false,
        enableHiding: false,
        size: 60
      })
    }

    cols.push(...initialColumns)

    return cols
  }, [initialColumns, showRowNumbers])

  const table = useReactTable({
    data: initialData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters
    },
    getRowId: row => row.id.toString(),
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: enableFiltering ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFiltering ? getFacetedUniqueValues() : undefined
  })

  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-40' />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-5 w-12' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {(headerActions || enableColumnVisibility) && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>{headerActions}</div>
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700'
                >
                  <Columns3 className='h-4 w-4' />
                  <span className='hidden lg:inline'>Customize Columns</span>
                  <span className='lg:hidden'>Columns</span>
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                {table
                  .getAllColumns()
                  .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                  .map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={value => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <div className='relative overflow-x-auto rounded-lg border'>
        <Table className='min-w-full'>
          <TableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-gray-800' : 'bg-gray-800'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`px-6 py-4 text-gray-100 ${header.column.id === 'actions' ? 'sticky right-0 z-10 w-20 max-w-20 bg-gray-800' : ''}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className='border-border/50 border-b'>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={`px-6 py-4 ${cell.column.id === 'actions' ? 'bg-background sticky right-0 z-10 min-w-0 overflow-hidden' : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 px-6 py-4 text-center'>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isServerSidePagination && (
        <div className='flex items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='rows-per-page' className='text-sm font-medium'>
              Rows per page
            </Label>
            <Select
              value={`${pagination.take}`}
              onValueChange={value => {
                const newTake = Number(value)
                pagination.onPageChange(0) // Reset to first page
                // We need to call a callback to update the take parameter
                if (pagination.onPageSizeChange) {
                  pagination.onPageSizeChange(newTake)
                }
              }}
            >
              <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                <SelectValue placeholder={pagination.take} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-6'>
            <div className='flex items-center justify-center text-sm font-medium'>
              Page {Math.floor(pagination.skip / pagination.take) + 1} of{' '}
              {pagination.totalPages || Math.ceil(pagination.total / pagination.take)}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => pagination.onPageChange(0)}
                disabled={pagination.skip === 0}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => pagination.onPageChange(Math.max(0, pagination.skip - pagination.take))}
                disabled={pagination.skip === 0}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => pagination.onPageChange(pagination.skip + pagination.take)}
                disabled={pagination.skip + pagination.take >= pagination.total}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => {
                  const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.take)
                  pagination.onPageChange((totalPages - 1) * pagination.take)
                }}
                disabled={pagination.skip + pagination.take >= pagination.total}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
