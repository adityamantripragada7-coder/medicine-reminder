const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export const medicinesApi = {
  list: () => request('/api/medicines'),
  create: (medicine) => request('/api/medicines', { method: 'POST', body: JSON.stringify(medicine) }),
  update: (id, medicine) => request(`/api/medicines/${id}`, { method: 'PUT', body: JSON.stringify(medicine) }),
  remove: (id) => request(`/api/medicines/${id}`, { method: 'DELETE' }),
}
