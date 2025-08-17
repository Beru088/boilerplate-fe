'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Package, Search, Plus } from 'lucide-react'
import Link from 'next/link'
import ListPagination from '@/components/shared/pagination'
import { ArchiveObjectListItem } from '@/types/object'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useObjects } from '@/features/objects/api/object'
import { useDeleteObject, useRestoreObject } from '@/features/objects/api/object-mutation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatIsoDate, getMediaUrl } from '@/utils/helper'
import Image from 'next/image'

type ListParams = {
  search?: string
  categoryId?: number
  materialId?: number
  tag?: string
  status?: 'active' | 'inactive' | ''
  skip: number
  take: number
}

const ObjectsPage = () => {
  const [params, setParams] = useState<ListParams>({ search: '', skip: 0, take: 10 })
  const { objects, objectsLoading, objectsFetched, pagination } = useObjects(params)
  const del = useDeleteObject()
  const restore = useRestoreObject()

  const totalPages = pagination?.totalPages ?? 1

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Archive Objects</h1>
          <p className='text-muted-foreground'>Manage archive objects and metadata.</p>
        </div>
        <Button asChild>
          <Link href='/admin/archive/objects/create'>
            <Plus className='mr-2 h-4 w-4' /> New Object
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
            <Package className='h-5 w-5' />
            Object List
          </CardTitle>
          <CardDescription>Objects with category, material, tags and media.</CardDescription>
        </CardHeader>
        <CardContent>
          {!objectsFetched && objectsLoading ? (
            <div className='text-muted-foreground py-8 text-center'>Loading objects...</div>
          ) : objects.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>No objects found</div>
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
                    <TableHead className='text-center'>Created</TableHead>
                    <TableHead className='text-center'>Updated</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {objects.map((obj: ArchiveObjectListItem, idx: number) => {
                    const cover = obj.media?.find(m => m.isCover) || obj.media?.[0]

                    return (
                      <TableRow key={obj.id}>
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
                            {obj.objectTags.map(t => (
                              <Badge key={t.tag.id} variant='secondary'>
                                {t.tag.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>{formatIsoDate(obj.createdAt)}</TableCell>
                        <TableCell className='text-center'>{formatIsoDate(obj.updatedAt)}</TableCell>
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
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/archive/objects/${obj.id}/edit`}>Edit</Link>
                              </DropdownMenuItem>
                              {obj.deletedAt ? (
                                <DropdownMenuItem onClick={() => restore.mutate(obj.id)}>Restore</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className='text-red-600' onClick={() => del.mutate(obj.id)}>
                                  Delete
                                </DropdownMenuItem>
                              )}
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
                itemCount={objects.length}
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

export default ObjectsPage
