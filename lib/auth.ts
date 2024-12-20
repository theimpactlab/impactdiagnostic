// Simple client-side auth management
export const setAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAuthenticated', 'true')
  }
}

export const getAuth = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAuthenticated') === 'true'
  }
  return false
}

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated')
  }
}

