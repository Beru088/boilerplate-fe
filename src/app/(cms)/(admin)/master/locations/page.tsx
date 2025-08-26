'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocations } from '@/features/master-data/api/location'
import CreateLocationForm from '@/features/master-data/components/locations/create-location-form'
import UpdateLocationForm from '@/features/master-data/components/locations/update-location-form'
import DeleteLocation from '@/features/master-data/components/locations/delete-location'
import { Button } from '@/components/ui/button'
import { Filter, MoreHorizontal, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import type { ILocation } from '@/types/location'
import ListPagination from '@/components/shared/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatIsoDate } from '@/utils/helper'

const AdminMasterLocationsPage = () => {
  const { locations, locationsLoading } = useLocations()
  const [selected, setSelected] = useState<ILocation | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = useMemo(() => Math.max(1, Math.ceil((locations?.length || 0) / pageSize)), [locations])
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize

    return locations.slice(start, start + pageSize)
  }, [locations, currentPage])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Location</h1>
          <p className='text-muted-foreground'>Browse master locations list.</p>
        </div>
        <CreateLocationForm />
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
          <CardTitle>Locations</CardTitle>
          <CardDescription>All master locations</CardDescription>
        </CardHeader>
        <CardContent>
          {locationsLoading ? (
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
          ) : locations.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>No locations found</div>
          ) : (
            <div className='grid gap-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className='text-center'>Country</TableHead>
                    <TableHead className='text-center'>Province</TableHead>
                    <TableHead className='text-center'>City</TableHead>
                    <TableHead className='text-center'>Created</TableHead>
                    <TableHead className='text-center'>Updated</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((location, idx) => (
                    <TableRow key={location.id}>
                      <TableCell className='text-center'>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell className='font-medium'>{location.name}</TableCell>
                      <TableCell className='text-center'>{location.country?.name || '-'}</TableCell>
                      <TableCell className='text-center'>{location.province?.name || '-'}</TableCell>
                      <TableCell className='text-center'>{location.city?.name || '-'}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(location.createdAt)}</TableCell>
                      <TableCell className='text-center'>{formatIsoDate(location.updatedAt)}</TableCell>
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
                                setSelected(location)
                                setOpenEdit(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => {
                                setSelected(location)
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
        <UpdateLocationForm
          location={selected}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onSuccess={() => setSelected(null)}
        />
      )}
      {selected && (
        <DeleteLocation
          location={selected}
          open={openDelete}
          onOpenChange={setOpenDelete}
          onSuccess={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default AdminMasterLocationsPage
