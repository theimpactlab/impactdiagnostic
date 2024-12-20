'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'
import { PolarArea } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

interface AssessmentResult {
  [key: string]: any;
}

interface ScoreSummary {
  [key: string]: number;
}

export default function AssessmentResults({ params }: { params: { orgId: string } }) {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const [organizationName, setOrganizationName] = useState<string>('')
  const [scoreSummary, setScoreSummary] = useState<ScoreSummary>({})
  const [overallAverage, setOverallAverage] = useState<number>(0)
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
      calculateScoreSummary(assessmentData)
    } catch (error) {
      console.error('Error in fetchAssessmentResults:', error)
      setError(error instanceof Error ? error.message : 'Failed to load assessment results')
    } finally {
      setIsLoading(false)
    }
  }

  function calculateScoreSummary(data: AssessmentResult) {
    const summary: ScoreSummary = {
      'Purpose Alignment Score': data.alignment_score || 0,
      'Purpose Statement Score': calculateAverageScore([
        data.purpose_statement_length,
        data.purpose_statement_common_words,
        data.purpose_statement_uniqueness,
        data.purpose_statement_clarity,
        data.purpose_statement_focus
      ]),
      'Impact Leadership Score': calculateAverageScore([
        data.impact_leadership,
        data.impact_appetite,
        data.impact_desire,
        data.impact_culture,
        data.impact_blockers,
        data.impact_buy_in
      ]),
      'Theory of Change Score': calculateAverageScore([
        data.theory_of_change_completeness,
        data.theory_of_change_use,
        data.theory_of_change_willingness,
        data.theory_of_change_simplicity,
        data.theory_of_change_definitions
      ]),
      'Measurement Framework Score': calculateAverageScore([
        data.measurement_framework_feasibility,
        data.measurement_framework_indicators,
        data.measurement_framework_outcomes,
        data.measurement_framework_validation,
        data.measurement_framework_comparison,
        data.measurement_framework_demographics,
        data.measurement_framework_segmentation
      ]),
      'Data Review Score': calculateAverageScore([
        data.data_structure,
        data.data_uniqueness,
        data.data_expertise,
        data.data_completeness,
        data.data_quality,
        data.data_consistency,
        data.data_effectiveness,
        data.data_automaticity
      ]),
      'System Review Score': calculateAverageScore([
        data.system_appropriate,
        data.system_fitness,
        data.system_personnel,
        data.system_customization,
        data.system_connectivity
      ])
    }

    setScoreSummary(summary)
    setOverallAverage(calculateAverageScore(Object.values(summary)))
  }

  function calculateAverageScore(scores: (number | null)[]): number {
    const validScores = scores.filter((score): score is number => score !== null)
    return validScores.length > 0
      ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2))
      : 0
  }

  function determineBackgroundColor(score: number): string {
    if (score <= 4) {
      return 'rgba(232, 99, 99, 0.6)' // Red for low scores
    } else if (score <= 7) {
      return 'rgba(255, 206, 86, 0.6)' // Amber for medium scores
    } else {
      return 'rgba(75, 192, 192, 0.6)' // Green for high scores
    }
  }

  const chartData = {
    labels: Object.keys(scoreSummary),
    datasets: [
      {
        label: 'Average Scores',
        data: Object.values(scoreSummary),
        backgroundColor: Object.values(scoreSummary).map(determineBackgroundColor),
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || ''
            let value = context.raw || 0
            return `${label}: ${value}`
          },
        },
      },
    },
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
        <div className="space-y-6">
          <div id="scoreSummary">
            <h2 className="text-xl font-semibold mb-4">Score Summary</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Section</th>
                  <th className="border border-gray-300 p-2">Average Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scoreSummary).map(([section, score]) => (
                  <tr key={section}>
                    <td className="border border-gray-300 p-2">{section}</td>
                    <td className="border border-gray-300 p-2">{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div id="overallAverageScoreDisplay">
            <h2 className="text-xl font-semibold">Overall Average Score: {overallAverage}</h2>
          </div>

          <div className="chart-container" style={{ height: '400px' }}>
            <PolarArea data={chartData} options={chartOptions} />
          </div>

          <Button 
            onClick={() => router.push('/dashboard')} 
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

