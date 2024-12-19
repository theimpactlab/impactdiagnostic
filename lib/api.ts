export async function saveAssessment(data: any) {
  const response = await fetch('/api/assessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to save assessment')
  }
  return response.json()
}

export async function getAssessment(organizationName: string) {
  const response = await fetch(`/api/assessment?organizationName=${encodeURIComponent(organizationName)}`)
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to retrieve assessment')
  }
  return response.json()
}

