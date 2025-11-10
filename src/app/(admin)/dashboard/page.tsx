'use client'

import Image from 'next/image'

const AdminDashboard = () => {
  return (
    <div className='relative flex h-full w-full items-center justify-center'>
      <Image src='/images/background-dashboard.png' alt='background' fill className='object-cover' priority />
    </div>
  )
}

export default AdminDashboard
