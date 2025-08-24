'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Package, Search, Archive } from 'lucide-react'
import Link from 'next/link'
import ListPagination from '@/components/shared/pagination'
import { IObject } from '@/types/objects'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDeletedObjects } from '@/features/objects/api/object'
import { useRestoreObject } from '@/features/objects/api/object-mutation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatIsoDate, getMediaUrl } from '@/utils/helper'
import Image from 'next/image'

type ListParams = {
  search?: string
  categoryId?: number
  materialId?: number
  tag?: string
  skip: number
  take: number
}

const DeletedObjectsPage = () => {
  const [params, setParams] = useState<ListParams>({ search: '', skip: 0, take: 10 })
  const { deletedObjects, deletedObjectsLoading, deletedObjectsFetched, pagination } = useDeletedObjects(params)
  const restore = useRestoreObject()

  const totalPages = pagination?.totalPages ?? 1

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Deleted Objects</h1>
          <p className='text-muted-foreground'>Manage and restore archived objects from the system.</p>
        </div>
        <Button variant='outline' asChild>
          <Link href='/admin/archive/objects'>
            <Package className='mr-2 h-4 w-4' /> Back to Objects
          </Link>
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='outline'>
          <Search className='mr-2 h-4 w-4' />
          Search
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Archive className='h-5 w-5' />
            Deleted Objects List
          </CardTitle>
          <CardDescription>Archived objects that can be restored or permanently deleted.</CardDescription>
        </CardHeader>
        <CardContent>
          {!deletedObjectsFetched && deletedObjectsLoading ? (
            <div className='text-muted-foreground py-8 text-center'>Loading deleted objects...</div>
          ) : deletedObjects.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>No deleted objects found</div>
          ) : (
            <div className='grid gap-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>No</TableHead>
                    <TableHead className='text-center'>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className='text-center'>Category</TableHead>
                    <TableHead className='text-center'>Material</TableHead>
                    <TableHead className='text-center'>Tags</TableHead>
                    <TableHead className='text-center'>Deleted Date</TableHead>
                    <TableHead className='text-center'>Created</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedObjects.map((obj: IObject, idx: number) => {
                    const cover = obj.media?.find(m => m.isCover) || obj.media?.[0]

                    return (
                      <TableRow key={obj.id} className='opacity-75'>
                        <TableCell className='text-center'>{(params.skip || 0) + idx + 1}</TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center justify-center'>
                            {cover ? (
                              <Image
                                src={getMediaUrl(cover.url)}
                                alt={obj.title}
                                width={64}
                                height={64}
                                className='h-16 w-16 rounded object-cover'
                              />
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className='font-medium'>
                          <div>{obj.title}</div>
                          <div className='text-muted-foreground text-xs'>#{obj.id}</div>
                        </TableCell>
                        <TableCell className='text-center'>{obj.category?.name}</TableCell>
                        <TableCell className='text-center'>{obj.material?.name}</TableCell>
                        <TableCell className='text-center'>
                          <div className='flex flex-wrap justify-center gap-1'>
                            {obj.objectTags?.map(t => (
                              <Badge key={t.tag.id} variant='secondary'>
                                {t.tag.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Badge variant='destructive' className='text-xs'>
                            {obj.deletedAt ? formatIsoDate(obj.deletedAt) : 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-center'>{formatIsoDate(obj.createdAt)}</TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/archive/objects/${obj.id}`} className='flex items-center'>
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => restore.mutate(obj.id)} className='text-green-600'>
                                Restore
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <ListPagination
                skip={params.skip}
                take={params.take}
                totalPages={totalPages}
                itemCount={deletedObjects.length}
                onChangeSkip={nextSkip => setParams(prev => ({ ...prev, skip: nextSkip }))}
                className='mt-4'
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeletedObjectsPage
