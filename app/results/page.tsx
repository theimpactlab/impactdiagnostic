'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAssessment } from '../../lib/api'

export default function Results() {
  const router = useRouter()
  const [results, setResults] = useState(null)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getAssessment('LAST_SAVED_ASSESSMENT')
        setResults(data)
      } catch (error) {
        console.error('Failed to load results:', error)
      }
    }
    loadResults()
  }, [])

  if (!results) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <Card className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display results here */}
            <pre>{JSON.stringify(results, null, 2)}</pre>
            <Button onClick={() => router.push('/')}>Back to Assessment</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

