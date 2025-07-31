import React from 'react'
import AppGroupLayout from './_components/app-layout'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppGroupLayout>{children}</AppGroupLayout>
}
export default AuthLayout
