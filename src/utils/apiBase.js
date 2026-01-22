const rawBase = import.meta.env.VITE_API_BASE || ''
const normalizedBase = rawBase.replace(/\/$/, '')

export const apiUrl = (path) => {
  if (!normalizedBase) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${cleanPath}`
}
