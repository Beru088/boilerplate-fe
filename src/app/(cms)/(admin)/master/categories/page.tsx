'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategories } from '@/features/master-data/api/categories'
import CreateCategoryForm from '@/features/master-data/components/categories/create-category-form'
import UpdateCategoryForm from '@/features/master-data/components/categories/update-category-form'
import DeleteCategory from '@/features/master-data/components/categories/delete-category'
import { Button } from '@/components/ui/button'
import { Filter, MoreHorizontal, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import type { ICategory } from '@/types/categories'
import ListPagination from '@/components/shared/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { getMediaUrl } from '@/utils/helper'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatIsoDate } from '@/utils/helper'

const AdminMasterCategoriesPage = () => {
  const { categories, categoriesLoading } = useCategories()
  const [selected, setSelected] = useState<ICategory | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = useMemo(() => Math.max(1, Math.ceil((categories?.length || 0) / pageSize)), [categories])
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize

    return categories.slice(start, start + pageSize)
  }, [categories, currentPage])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Category</h1>
          <p className='text-muted-foreground'>Browse master categories list.</p>
        </div>
        <CreateCategoryForm />
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='outline'>
          <Search className='mr-2 h-4 w-4' />
          Search
        </Button>
        <Button variant='outline'>
          <Filter className='mr-2 h-4 w-4' />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>All master categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, index) => (
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
          ) : categories.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>No categories found</div>
          ) : (
            <div className='grid gap-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>No</TableHead>
                    <TableHead className='text-center'>Thumbnail</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className='text-center'>Description</TableHead>
                    <TableHead className='text-center'>Created</TableHead>
                    <TableHead className='text-center'>Updated</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((cat, idx) => (
                    <TableRow key={cat.id}>
                      <TableCell className='text-center'>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell className='text-center'>
                        <div className='flex items-center justify-center'>
                          {cat.thumbnail ? (
                            <Image
                              src={getMediaUrl(cat.thumbnail)}
                              alt={cat.name}
                              width={60}
                              height={60}
                              className='h-16 w-16 rounded object-cover'
                            />
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>{cat.name}</TableCell>
                      <TableCell className='text-muted-foreground text-center'>
                        {cat.description || 'no description'}
                      </TableCell>
                      <TableCell className='text-center'>{formatIsoDate(cat.createdAt)}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(cat.updatedAt)}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(cat)
                                setOpenEdit(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => {
                                setSelected(cat)
                                setOpenDelete(true)
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className='mt-4'
              />
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <UpdateCategoryForm
          category={selected}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onSuccess={() => setSelected(null)}
        />
      )}
      {selected && (
        <DeleteCategory
          category={selected}
          open={openDelete}
          onOpenChange={setOpenDelete}
          onSuccess={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default AdminMasterCategoriesPage
