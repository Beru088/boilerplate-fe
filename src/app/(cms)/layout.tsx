'use client'

import React from 'react'
import AdminGroupLayout from './_components/admin-layout'
import RoleGuard from '@/components/shared/role-guard'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={['superadmin', 'admin', 'contributor']} redirectTo='/explore'>
      <AdminGroupLayout>{children}</AdminGroupLayout>
    </RoleGuard>
  )
}
export default AuthLayout
