import ChangeRequestDetail from '@/features/change-request/components/change-request-detail'

interface ChangeRequestDetailPageProps {
  params: {
    id: string
  }
}

const ChangeRequestDetailPage = ({ params }: ChangeRequestDetailPageProps) => {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return (
      <div className='p-6'>
        <p className='text-red-600'>Invalid change request ID</p>
      </div>
    )
  }

  return <ChangeRequestDetail id={id} />
}

export default ChangeRequestDetailPage
