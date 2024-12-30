'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from '@/lib/supabase'
import { PolarArea } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Loader2 } from 'lucide-react'
import { ChartOptions } from 'chart.js'
import { CSVLink } from "react-csv"

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Title)

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
  const csvLinkRef = useRef<HTMLAnchorElement>(null);

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
      'Purpose Alignment': data.alignment_score || 0,
      'Purpose Statement': calculateAverageScore([
        data.purpose_statement_length,
        data.purpose_statement_common_words,
        data.purpose_statement_uniqueness,
        data.purpose_statement_clarity,
        data.purpose_statement_focus
      ]),
      'Impact Leadership': calculateAverageScore([
        data.impact_leadership,
        data.impact_appetite,
        data.impact_desire,
        data.impact_culture,
        data.impact_blockers,
        data.impact_buy_in
      ]),
      'Theory of Change': calculateAverageScore([
        data.theory_of_change_completeness,
        data.theory_of_change_use,
        data.theory_of_change_willingness,
        data.theory_of_change_simplicity,
        data.theory_of_change_definitions
      ]),
      'Measurement Framework': calculateAverageScore([
        data.measurement_framework_feasibility,
        data.measurement_framework_indicators,
        data.measurement_framework_outcomes,
        data.measurement_framework_validation,
        data.measurement_framework_comparison,
        data.measurement_framework_demographics,
        data.measurement_framework_segmentation
      ]),
      'Data Review': calculateAverageScore([
        data.data_structure,
        data.data_uniqueness,
        data.data_expertise,
        data.data_completeness,
        data.data_quality,
        data.data_consistency,
        data.data_effectiveness,
        data.data_automaticity
      ]),
      'System Review': calculateAverageScore([
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
      return '#EF4444' // Red for low scores
    } else if (score <= 7) {
      return '#FBBF24' // Amber for medium scores
    } else {
      return '#22C55E' // Green for high scores
    }
  }

  function getScoreDescription(score: number): string {
    if (score <= 4) {
      return 'Needs significant improvement'
    } else if (score <= 7) {
      return 'Shows promise, but room for growth'
    } else {
      return 'Strong performance'
    }
  }

  function prepareCSVData(): Array<{ Section: string; Score: number }> {
    return Object.entries(scoreSummary).map(([section, score]) => ({
      Section: section,
      Score: score,
    }))
  }

  const chartData = {
    labels: Object.keys(scoreSummary),
    datasets: [
      {
        label: 'Average Scores',
        data: Object.values(scoreSummary),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
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
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 14
          }
        },
      },
      title: {
        display: true,
        text: 'Impact Assessment Results',
        font: {
          size: 20,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || ''
            let value = context.raw || 0
            return `${label}: ${value.toFixed(2)}`
          },
        },
      },
    },
  }

  const handleDownloadCSV = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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
    <div className="container mx-auto py-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Assessment Results for {organizationName}</CardTitle>
          <CardDescription className="text-center text-lg mt-2">Review your organization's performance across key areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList className="flex justify-center">
              <TabsTrigger value="summary" className="px-6 py-2">Summary</TabsTrigger>
              <TabsTrigger value="chart" className="px-6 py-2">Chart</TabsTrigger>
              <TabsTrigger value="details" className="px-6 py-2">Detailed Scores</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-100 rounded-lg shadow-inner">
                  <h2 className="text-2xl font-bold pb-3 mb-3 border-b-2 border-gray-300">Overall Summary</h2>
                  <p className="text-5xl font-bold text-blue-600 mb-2">{overallAverage.toFixed(2)}</p>
                  <p className="text-xl text-gray-600">{getScoreDescription(overallAverage)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(scoreSummary).map(([section, score]) => (
                    <Card key={section} className="p-4 hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-lg font-semibold mb-2">{section}</h3>
                      <p className="text-3xl font-bold mb-1" style={{color: determineBackgroundColor(score)}}>{score.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{getScoreDescription(score)}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chart">
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Impact Assessment Results</h2>
                  <Button
                    onClick={handleDownloadCSV}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Download CSV
                  </Button>
                </div>
                <div className="chart-container mx-auto" style={{ height: '600px', maxWidth: '800px' }}>
                  <PolarArea data={chartData} options={chartOptions} />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 border-b border-r text-left font-semibold text-gray-600">Section</th>
                        <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(scoreSummary).map(([section, score], index) => (
                        <tr key={section} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-3 px-4 border-b border-r">{section}</td>
                          <td className="py-3 px-4 border-b font-semibold" style={{color: determineBackgroundColor(score)}}>
                            {score.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="space-y-4">
                {results && Object.entries(results).map(([key, value]) => (
                  <div key={key} className="border-b pb-3">
                    <h3 className="text-lg font-semibold mb-1">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p className="text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <CSVLink
            data={prepareCSVData()}
            filename={`${organizationName.replace(/\s+/g, '_')}_assessment_results.csv`}
            className="hidden"
            ref={csvLinkRef}
          />
          <div className="mt-8 flex justify-between">
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="outline"
              className="px-6 py-2 text-lg"
            >
              Return to Dashboard
            </Button>
            <Button 
              onClick={() => router.push(`/assessment/${params.orgId}`)}
              className="px-6 py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

