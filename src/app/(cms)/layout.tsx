import React from 'react'
import AdminGroupLayout from './_components/admin-layout'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <AdminGroupLayout>{children}</AdminGroupLayout>
}
export default AuthLayout
