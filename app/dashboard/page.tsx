'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [newOrgName, setNewOrgName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchOrganizations()
  }, [])

  async function fetchOrganizations() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching organizations:', error)
        throw new Error('Failed to fetch organizations')
      }

      console.log('Fetched organizations:', data)
      setOrganizations(data || [])
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function createNewOrganization(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      if (!newOrgName.trim()) {
        throw new Error('Organization name is required')
      }

      console.log('Creating new organization:', newOrgName)
      
      const { data, error } = await supabase
        .from('organizations')
        .insert([{ name: newOrgName.trim() }])
        .select()
      
      if (error) {
        console.error('Error creating organization:', error)
        throw new Error('Failed to create organization')
      }

      console.log('Created organization:', data)
      setNewOrgName('')
      await fetchOrganizations()
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to create organization')
    }
  }

  function startAssessment(orgId: number) {
    console.log('Starting assessment for organization:', orgId)
    router.push(`/assessment/${orgId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading organizations...</h2>
          <p className="text-gray-500">Please wait while we fetch the data.</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Assessment Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Create New Organization</h2>
            <form onSubmit={createNewOrganization} className="flex space-x-2">
              <Input
                type="text"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter organization name"
                required
              />
              <Button type="submit">Create</Button>
            </form>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Organizations</h2>
            {organizations.length === 0 ? (
              <p className="text-gray-500">No organizations found. Create one above to get started.</p>
            ) : (
              <ul className="space-y-2">
                {organizations.map((org) => (
                  <li key={org.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{org.name}</span>
                    <Button 
                      onClick={() => startAssessment(org.id)}
                      className="bg-[#f7d32e] text-black hover:bg-[#e6c41d]"
                    >
                      Start Assessment
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

