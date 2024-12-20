'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'

interface AssessmentResult {
  [key: string]: any;
}

export default function AssessmentResults({ params }: { params: { orgId: string } }) {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const [organizationName, setOrganizationName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssessmentResults()
  }, [params.orgId])

  async function fetchAssessmentResults() {
    setIsLoading(true)
    setError(null)

    try {
      const orgId = parseInt(params.orgId, 10)
      if (isNaN(orgId)) {
        throw new Error('Invalid organization ID')
      }

      // Fetch organization name
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', orgId)
        .single()

      if (orgError) {
        console.error('Error fetching organization:', orgError)
        throw new Error(`Organization not found: ${orgError.message}`)
      }

      setOrganizationName(orgData.name)

      // Fetch assessment results
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('organization_id', orgId)
        .single()

      if (assessmentError) {
        console.error('Error fetching assessment:', assessmentError)
        throw new Error(`Error fetching assessment data: ${assessmentError.message}`)
      }

      setResults(assessmentData)
    } catch (error) {
      console.error('Error in fetchAssessmentResults:', error)
      setError(error instanceof Error ? error.message : 'Failed to load assessment results')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading assessment results...</h2>
          <p className="text-gray-500">Please wait while we fetch the data.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">{error}</h2>
          <Button 
            onClick={() => router.push('/dashboard')} 
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Assessment Results for {organizationName}</CardTitle>
      </CardHeader>
      <CardContent>
        {results ? (
          <div className="space-y-6">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                <p>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No assessment results found.</p>
        )}
        <Button 
          onClick={() => router.push('/dashboard')} 
          className="mt-6"
        >
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  )
}

