'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubLocations } from '@/features/master-data/api/location'
import CreateSubLocationForm from '@/features/master-data/components/sub-locations/create-sub-location-form'
import UpdateSubLocationForm from '@/features/master-data/components/sub-locations/update-sub-location-form'
import DeleteSubLocation from '@/features/master-data/components/sub-locations/delete-sub-location'
import { Button } from '@/components/ui/button'
import { Filter, MoreHorizontal, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import type { ISubLocation } from '@/types/location'
import ListPagination from '@/components/shared/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatIsoDate } from '@/utils/helper'

const AdminMasterSubLocationsPage = () => {
  const { subLocations, subLocationsLoading } = useSubLocations()
  const [selected, setSelected] = useState<ISubLocation | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = useMemo(() => Math.max(1, Math.ceil((subLocations?.length || 0) / pageSize)), [subLocations])
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize

    return subLocations.slice(start, start + pageSize)
  }, [subLocations, currentPage])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Sub Location</h1>
          <p className='text-muted-foreground'>Browse master sub-locations list.</p>
        </div>
        <CreateSubLocationForm />
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
          <CardTitle>Sub Locations</CardTitle>
          <CardDescription>All master sub-locations</CardDescription>
        </CardHeader>
        <CardContent>
          {subLocationsLoading ? (
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
          ) : subLocations.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>No sub-locations found</div>
          ) : (
            <div className='grid gap-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className='text-center'>Parent Location</TableHead>
                    <TableHead className='text-center'>Created</TableHead>
                    <TableHead className='text-center'>Updated</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((subLocation, idx) => (
                    <TableRow key={subLocation.id}>
                      <TableCell className='text-center'>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell className='font-medium'>{subLocation.name}</TableCell>
                      <TableCell className='text-center'>{subLocation.location?.name || '-'}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(subLocation.createdAt)}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(subLocation.updatedAt)}</TableCell>
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
                                setSelected(subLocation)
                                setOpenEdit(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => {
                                setSelected(subLocation)
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
        <UpdateSubLocationForm
          subLocation={selected}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onSuccess={() => setSelected(null)}
        />
      )}
      {selected && (
        <DeleteSubLocation
          subLocation={selected}
          open={openDelete}
          onOpenChange={setOpenDelete}
          onSuccess={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default AdminMasterSubLocationsPage
