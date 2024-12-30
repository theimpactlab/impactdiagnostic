'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreSelect } from "@/components/ui/score-select"
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface AssessmentFormData {
  organizationName: string;
  lead_impact_consultant: string;
  research_consultant: string;
  data_consultant: string;
  alignment_score: string;
  purpose_statement_length: string;
  purpose_statement_common_words: string;
  purpose_statement_uniqueness: string;
  purpose_statement_clarity: string;
  purpose_statement_focus: string;
  impact_leadership: string;
  impact_appetite: string;
  impact_desire: string;
  impact_culture: string;
  impact_blockers: string;
  impact_buy_in: string;
  theory_of_change_completeness: string;
  theory_of_change_use: string;
  theory_of_change_willingness: string;
  theory_of_change_simplicity: string;
  theory_of_change_definitions: string;
  measurement_framework_feasibility: string;
  measurement_framework_indicators: string;
  measurement_framework_outcomes: string;
  measurement_framework_validation: string;
  measurement_framework_comparison: string;
  measurement_framework_demographics: string;
  measurement_framework_segmentation: string;
  data_structure: string;
  data_uniqueness: string;
  data_expertise: string;
  data_completeness: string;
  data_quality: string;
  data_consistency: string;
  data_effectiveness: string;
  data_automaticity: string;
  system_appropriate: string;
  system_fitness: string;
  system_personnel: string;
  system_customization: string;
  system_connectivity: string;
}

const initialFormData: AssessmentFormData = {
  organizationName: '',
  lead_impact_consultant: '',
  research_consultant: '',
  data_consultant: '',
  alignment_score: '',
  purpose_statement_length: '',
  purpose_statement_common_words: '',
  purpose_statement_uniqueness: '',
  purpose_statement_clarity: '',
  purpose_statement_focus: '',
  impact_leadership: '',
  impact_appetite: '',
  impact_desire: '',
  impact_culture: '',
  impact_blockers: '',
  impact_buy_in: '',
  theory_of_change_completeness: '',
  theory_of_change_use: '',
  theory_of_change_willingness: '',
  theory_of_change_simplicity: '',
  theory_of_change_definitions: '',
  measurement_framework_feasibility: '',
  measurement_framework_indicators: '',
  measurement_framework_outcomes: '',
  measurement_framework_validation: '',
  measurement_framework_comparison: '',
  measurement_framework_demographics: '',
  measurement_framework_segmentation: '',
  data_structure: '',
  data_uniqueness: '',
  data_expertise: '',
  data_completeness: '',
  data_quality: '',
  data_consistency: '',
  data_effectiveness: '',
  data_automaticity: '',
  system_appropriate: '',
  system_fitness: '',
  system_personnel: '',
  system_customization: '',
  system_connectivity: '',
};

export default function AssessmentForm({ params }: { params: { orgId: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("organization")

  useEffect(() => {
    fetchAssessmentData()
  }, [])

  async function fetchAssessmentData() {
    setIsLoading(true)
    setError(null)

    try {
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('organization_id', params.orgId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (assessmentError && assessmentError.code !== 'PGRST116') {
        throw assessmentError
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', params.orgId)
        .single()

      if (orgError) {
        throw orgError
      }

      if (assessmentData) {
        setFormData({ ...assessmentData, organizationName: orgData.name })
      } else {
        setFormData({ ...initialFormData, organizationName: orgData.name })
      }
    } catch (error) {
      console.error('Error in fetchAssessmentData:', error)
      setError(error instanceof Error ? error.message : 'Failed to load assessment data')
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  function handleSelectChange(name: string, value: string) {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('assessments')
        .upsert({ ...formData, organization_id: params.orgId })
        .select()

      if (error) {
        throw error
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setError(error instanceof Error ? error.message : 'Failed to save assessment data')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Loading assessment...</h2>
          <p className="text-gray-600">Please wait while we fetch the data.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">{error}</h2>
          <Button 
            onClick={() => router.push('/dashboard')} 
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <CardTitle className="text-3xl font-bold">Impact Assessment Form</CardTitle>
          <CardDescription className="text-indigo-100 mt-2">Evaluate the impact readiness of your organization</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 bg-indigo-100 p-1 rounded-lg">
                <TabsTrigger value="organization" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Organization</TabsTrigger>
                <TabsTrigger value="purpose" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Purpose</TabsTrigger>
                <TabsTrigger value="leadership" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Leadership</TabsTrigger>
                <TabsTrigger value="theory" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Theory of Change</TabsTrigger>
                <TabsTrigger value="measurement" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Measurement</TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Data</TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">System</TabsTrigger>
              </TabsList>
              <TabsContent value="organization" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="organizationName" className="text-lg font-medium text-gray-900">Organization Name</Label>
                        <Input
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lead_impact_consultant" className="text-lg font-medium text-gray-900">Lead Impact Consultant</Label>
                        <Input
                          id="lead_impact_consultant"
                          name="lead_impact_consultant"
                          value={formData.lead_impact_consultant}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="research_consultant" className="text-lg font-medium text-gray-900">Research Consultant</Label>
                        <Input
                          id="research_consultant"
                          name="research_consultant"
                          value={formData.research_consultant}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="data_consultant" className="text-lg font-medium text-gray-900">Data Consultant</Label>
                        <Input
                          id="data_consultant"
                          name="data_consultant"
                          value={formData.data_consultant}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="purpose" className="space-y-6">
                <ScoreSelect
                  name="alignment_score"
                  label="What was your team's alignment to purpose score?"
                  value={formData.alignment_score}
                  onChange={handleSelectChange}
                  isAlignmentScore={true}
                />
                <ScoreSelect
                  name="purpose_statement_length"
                  label="To what extent is your purpose statement succinct?"
                  value={formData.purpose_statement_length}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="purpose_statement_common_words"
                  label="How prevalent are common words in your purpose statement?"
                  value={formData.purpose_statement_common_words}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="purpose_statement_uniqueness"
                  label="To what extent do you feel your purpose statement is unique to your organisation?"
                  value={formData.purpose_statement_uniqueness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="purpose_statement_clarity"
                  label="How clear is your purpose statement?"
                  value={formData.purpose_statement_clarity}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="purpose_statement_focus"
                  label="How focussed is your purpose statement?"
                  value={formData.purpose_statement_focus}
                  onChange={handleSelectChange}
                />
              </TabsContent>
              <TabsContent value="leadership" className="space-y-6">
                <ScoreSelect
                  name="impact_leadership"
                  label="To what extent would you agree that impact is led from the top of your organisation?"
                  value={formData.impact_leadership}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="impact_appetite"
                  label="To what extent do you agree that people in your organisation are excited about delivering social impact?"
                  value={formData.impact_appetite}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="impact_desire"
                  label="To what extent would you agree work around understanding and measuring impact has been successfully undertaken in the organisation?"
                  value={formData.impact_desire}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="impact_culture"
                  label="To what extent do you feel the organisation is willing to undertake further work around understanding and measuring impact?"
                  value={formData.impact_culture}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="impact_blockers"
                  label="To what extent would you agree that your organisation currently has a culture of understanding and measuring impact?"
                  value={formData.impact_blockers}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="impact_buy_in"
                  label="How easy would it be to achieve buy-in from key people in your organisation to develop impact practices and measure them?"
                  value={formData.impact_buy_in}
                  onChange={handleSelectChange}
                />
              </TabsContent>
              <TabsContent value="theory" className="space-y-6">
                <ScoreSelect
                  name="theory_of_change_completeness"
                  label="How complete do you believe your theory of change is?"
                  value={formData.theory_of_change_completeness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="theory_of_change_use"
                  label="To what extent is your theory of change used to drive the work of your organisation?"
                  value={formData.theory_of_change_use}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="theory_of_change_willingness"
                  label="To what extent do you think your organisation would be willing to revisit your theory of change?"
                  value={formData.theory_of_change_willingness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="theory_of_change_simplicity"
                  label="To what extent do you agree that your theory of change is simple and straight forward?"
                  value={formData.theory_of_change_simplicity}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="theory_of_change_definitions"
                  label="To what extent would you agree that the measures in your theory of change are measures of impact and not measures of reach?"
                  value={formData.theory_of_change_definitions}
                  onChange={handleSelectChange}
                />
              </TabsContent>
              <TabsContent value="measurement" className="space-y-6">
                <ScoreSelect
                  name="measurement_framework_feasibility"
                  label="Is your framework feasible, cost effective, time efficient, resource appropriate and producing good quality, and reliable data?"
                  value={formData.measurement_framework_feasibility}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="measurement_framework_indicators"
                  label="To what extent do you feel you are measuring too many things?"
                  value={formData.measurement_framework_indicators}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="measurement_framework_outcomes"
                  label="To what extent do you feel that you are collecting only output rather than outcome measures?"
                  value={formData.measurement_framework_outcomes}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="measurement_framework_validation"
                  label="To what extent do you believe your outcomes measures are based on validated scales?"
                  value={formData.measurement_framework_validation}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="measurement_framework_comparison"
                  label="To what extent do you feel you can compare your organisations impact to others?"
                  value={formData.measurement_framework_comparison}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="measurement_framework_demographics"
                  label="To what extent are you able to use demographic measures to assess your reaching your target population?"
                  value={formData.measurement_framework_demographics}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="measurement_framework_segmentation"
                  label="To what extent are you using factors to interrogate your outcome measures by characteristic?"
                  value={formData.measurement_framework_segmentation}
                  onChange={handleSelectChange}
                />
              </TabsContent>
              <TabsContent value="data" className="space-y-6">
                <ScoreSelect
                  name="data_structure"
                  label="To what extent do you use defined and structured data fields rather than free text?"
                  value={formData.data_structure}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_uniqueness"
                  label="To what extent are you able to use your data and systems to track participants over time?"
                  value={formData.data_uniqueness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_expertise"
                  label="To what extent would you describe your staff as 'data savvy'?"
                  value={formData.data_expertise}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_completeness"
                  label="How confident are you that you have complete and useful datasets collected from beneficiaries?"
                  value={formData.data_completeness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_quality"
                  label="To what extent is your data quality checked and maintained regularly?"
                  value={formData.data_quality}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_consistency"
                  label="Is data structure and format consistent over time?"
                  value={formData.data_consistency}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_effectiveness"
                  label="To what extent do you believe your data is being effectively collected and reported on?"
                  value={formData.data_effectiveness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="data_automaticity"
                  label="To what extent is your data capture automated and free from manual processes?"
                  value={formData.data_automaticity}
                  onChange={handleSelectChange}
                />
              </TabsContent>
              <TabsContent value="system" className="space-y-6">
                <ScoreSelect
                  name="system_appropriate"
                  label="Is the number of systems being operated appropriate for the organisation?"
                  value={formData.system_appropriate}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="system_fitness"
                  label="Are the systems modern and fit for purpose?"
                  value={formData.system_fitness}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="system_personnel"
                  label="Does the organisation have the appropriate personnel and support in place to run their systems?"
                  value={formData.system_personnel}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="system_customization"
                  label="Is it possible for the client to customise impact relevant systems without external support services?"
                  value={formData.system_customization}
                  onChange={handleSelectChange}
                />
                <ScoreSelect
                  name="system_connectivity"
                  label="If applicable, Are your systems able interact with each other?"
                  value={formData.system_connectivity}
                  onChange={handleSelectChange}
                />
              </TabsContent>
            </Tabs>
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Assessment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

