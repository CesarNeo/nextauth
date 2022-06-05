import { useAuth } from '../contexts/AuthContext'

type UseCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return false
  }

  if (permissions?.length) {
    const hasAllPermissions = permissions.every(permission => {
      return user?.permissions.includes(permission)
    })

    if (!hasAllPermissions) {
      return false
    }
  }

  if (roles?.length) {
    const hasAllRoles = roles.some(role => {
      return user?.roles.includes(role)
    })

    if (!hasAllRoles) {
      return false
    }
  }

  return true
}
