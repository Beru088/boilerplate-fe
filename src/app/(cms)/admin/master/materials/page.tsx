'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatIsoDate } from '@/utils/helper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMaterials } from '@/features/master-data/api/materials'
import CreateMaterialForm from '@/features/master-data/components/materials/create-material-form'
import UpdateMaterialForm from '@/features/master-data/components/materials/update-material-form'
import DeleteMaterial from '@/features/master-data/components/materials/delete-material'
import { Button } from '@/components/ui/button'
import { Filter, MoreHorizontal, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import type { MaterialRow } from '@/types/object'
import ListPagination from '@/components/shared/pagination'
import { Skeleton } from '@/components/ui/skeleton'

const AdminMasterMaterialsPage = () => {
  const { materials, materialsLoading } = useMaterials()
  const [selected, setSelected] = useState<MaterialRow | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = useMemo(() => Math.max(1, Math.ceil((materials?.length || 0) / pageSize)), [materials])
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return materials.slice(start, start + pageSize)
  }, [materials, currentPage])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Material</h1>
          <p className='text-muted-foreground'>Browse master materials list.</p>
        </div>
        <CreateMaterialForm />
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
          <CardTitle>Materials</CardTitle>
          <CardDescription>All master materials</CardDescription>
        </CardHeader>
        <CardContent>
          {materialsLoading ? (
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
          ) : materials.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>No materials found</div>
          ) : (
            <div className='grid gap-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>No</TableHead>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-center'>Created</TableHead>
                    <TableHead className='text-center'>Updated</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((mat, idx) => (
                    <TableRow key={mat.id}>
                      <TableCell className='text-center'>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell className='text-center font-medium'>{mat.name}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(mat.createdAt)}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(mat.updatedAt)}</TableCell>
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
                                setSelected(mat)
                                setOpenEdit(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => {
                                setSelected(mat)
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
        <UpdateMaterialForm
          material={selected}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onSuccess={() => setSelected(null)}
        />
      )}
      {selected && (
        <DeleteMaterial
          material={selected}
          open={openDelete}
          onOpenChange={setOpenDelete}
          onSuccess={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default AdminMasterMaterialsPage
