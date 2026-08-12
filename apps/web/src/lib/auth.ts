export type AuthUser = {
  name: string
  email: string
  avatar?: string
}

export type AuthContext = {
  user: AuthUser | null
  login: (user: AuthUser) => Promise<void>
  logout: () => Promise<void>
}

const STORAGE_KEY = "auth:user"

export function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}