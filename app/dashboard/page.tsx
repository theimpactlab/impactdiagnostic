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
  const router = useRouter()

  useEffect(() => {
    fetchOrganizations()
  }, [])

  async function fetchOrganizations() {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
    
    if (error) {
      console.error('Error fetching organizations:', error)
    } else {
      setOrganizations(data || [])
    }
  }

  async function createNewOrganization(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('organizations')
      .insert([{ name: newOrgName }])
      .select()
    
    if (error) {
      console.error('Error creating new organization:', error)
    } else {
      setNewOrgName('')
      fetchOrganizations()
    }
  }

  function startAssessment(orgId: number) {
    router.push(`/assessment/${orgId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Assessment Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Existing Organizations</h2>
        <ul className="space-y-2 mb-8">
          {organizations.map((org) => (
            <li key={org.id} className="flex justify-between items-center">
              <span>{org.name}</span>
              <Button onClick={() => startAssessment(org.id)}>Start Assessment</Button>
            </li>
          ))}
        </ul>

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
      </CardContent>
    </Card>
  )
}

