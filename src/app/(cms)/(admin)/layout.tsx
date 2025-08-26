'use client'

import React from 'react'
import RoleGuard from '@/components/shared/role-guard'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={['superadmin', 'admin']} redirectTo='/dashboard' fullScreen={false}>
      {children}
    </RoleGuard>
  )
}
export default AuthLayout
