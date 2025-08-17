'use client'

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

type ControlledPageProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

type SkipTakeProps = {
  skip: number
  take: number
  totalPages?: number
  itemCount?: number
  onChangeSkip: (nextSkip: number) => void
  className?: string
}

type ListPaginationProps = ControlledPageProps | SkipTakeProps

const ListPagination = (props: ListPaginationProps) => {
  const totalPagesProp = props.totalPages
  const totalPages = totalPagesProp ?? 0
  const className = props.className

  const isSkipTake = 'skip' in props
  const currentPage = isSkipTake ? Math.floor(props.skip / props.take) + 1 : props.currentPage

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    if (isSkipTake) {
      const nextSkip = (page - 1) * props.take
      props.onChangeSkip(nextSkip)
    } else {
      props.onPageChange(page)
    }
  }

  const hasTotalPages = typeof totalPagesProp !== 'undefined'
  const shouldRenderNumbered = hasTotalPages && totalPages >= 1
  const canRenderPrevNextFallback = isSkipTake && !hasTotalPages

  if (!shouldRenderNumbered && !canRenderPrevNextFallback) return null

  const isFirstPage = currentPage <= 1
  const isLastPage = hasTotalPages ? currentPage >= totalPages : false

  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${isFirstPage ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => {
              if (isFirstPage) return
              handleChange(currentPage - 1)
            }}
          />
        </PaginationItem>
        {shouldRenderNumbered &&
          Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                className={`${totalPages === 1 && page === currentPage ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                isActive={page === currentPage}
                onClick={() => handleChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationNext
            className={`${hasTotalPages && isLastPage ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => {
              if (hasTotalPages) {
                if (isLastPage) return

                return handleChange(currentPage + 1)
              }
              if (canRenderPrevNextFallback) {
                const itemCount = (props as SkipTakeProps).itemCount ?? 0
                if (itemCount === props.take) handleChange(currentPage + 1)
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}

export default ListPagination
