'use client'

import React from 'react'
import AppGroupLayout from '@/components/layout/app-layout'
import RoleGuard from '@/components/auth/role-guard'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard requireAdmin={true} redirectTo='/'>
      <AppGroupLayout>{children}</AppGroupLayout>
    </RoleGuard>
  )
}
export default AuthLayout
