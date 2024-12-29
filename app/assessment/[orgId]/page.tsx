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
  alignment_score: number;
  purpose_statement_length: number;
  purpose_statement_common_words: number;
  purpose_statement_uniqueness: number;
  purpose_statement_clarity: number;
  purpose_statement_focus: number;
  impact_leadership: number;
  impact_appetite: number;
  impact_desire: number;
  impact_culture: number;
  impact_blockers: number;
  impact_buy_in: number;
  theory_of_change_completeness: number;
  theory_of_change_use: number;
  theory_of_change_willingness: number;
  theory_of_change_simplicity: number;
  theory_of_change_definitions: number;
  measurement_framework_feasibility: number;
  measurement_framework_indicators: number;
  measurement_framework_outcomes: number;
  measurement_framework_validation: number;
  measurement_framework_comparison: number;
  measurement_framework_demographics: number;
  measurement_framework_segmentation: number;
  data_structure: number;
  data_uniqueness: number;
  data_expertise: number;
  data_completeness: number;
  data_quality: number;
  data_consistency: number;
  data_effectiveness: number;
  data_automaticity: number;
  system_appropriate: number;
  system_fitness: number;
  system_personnel: number;
  system_customization: number;
  system_connectivity: number;
}

const initialFormData: AssessmentFormData = {
  organizationName: '',
  lead_impact_consultant: '',
  research_consultant: '',
  data_consultant: '',
  alignment_score: 0,
  purpose_statement_length: 0,
  purpose_statement_common_words: 0,
  purpose_statement_uniqueness: 0,
  purpose_statement_clarity: 0,
  purpose_statement_focus: 0,
  impact_leadership: 0,
  impact_appetite: 0,
  impact_desire: 0,
  impact_culture: 0,
  impact_blockers: 0,
  impact_buy_in: 0,
  theory_of_change_completeness: 0,
  theory_of_change_use: 0,
  theory_of_change_willingness: 0,
  theory_of_change_simplicity: 0,
  theory_of_change_definitions: 0,
  measurement_framework_feasibility: 0,
  measurement_framework_indicators: 0,
  measurement_framework_outcomes: 0,
  measurement_framework_validation: 0,
  measurement_framework_comparison: 0,
  measurement_framework_demographics: 0,
  measurement_framework_segmentation: 0,
  data_structure: 0,
  data_uniqueness: 0,
  data_expertise: 0,
  data_completeness: 0,
  data_quality: 0,
  data_consistency: 0,
  data_effectiveness: 0,
  data_automaticity: 0,
  system_appropriate: 0,
  system_fitness: 0,
  system_personnel: 0,
  system_customization: 0,
  system_connectivity: 0,
};

export default function AssessmentForm({ params }: { params: { orgId: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssessmentData()
  }, [])

  async function fetchAssessmentData() {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('organization_id', params.orgId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setFormData(data)
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

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, [event.target.name]: parseInt(event.target.value) })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('assessments')
        .upsert(formData)

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading assessment...</h2>
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
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Impact Assessment Form</CardTitle>
          <CardDescription>Evaluate the impact readiness of your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="organization" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="purpose">Purpose</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
                <TabsTrigger value="theory">Theory of Change</TabsTrigger>
                <TabsTrigger value="measurement">Measurement</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <TabsContent value="organization" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="lead_impact_consultant">Lead Impact Consultant</Label>
                      <Input
                        id="lead_impact_consultant"
                        name="lead_impact_consultant"
                        value={formData.lead_impact_consultant}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="research_consultant">Research Consultant</Label>
                      <Input
                        id="research_consultant"
                        name="research_consultant"
                        value={formData.research_consultant}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="data_consultant">Data Consultant</Label>
                      <Input
                        id="data_consultant"
                        name="data_consultant"
                        value={formData.data_consultant}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="purpose" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <ScoreSelect
                    name="alignment_score"
                    label="What was your team's alignment to purpose score?"
                    value={formData.alignment_score}
                    onChange={handleSelectChange}
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
                </div>
              </TabsContent>
              <TabsContent value="leadership" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              </TabsContent>
              <TabsContent value="theory" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              </TabsContent>
              <TabsContent value="measurement" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              </TabsContent>
              <TabsContent value="data" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              </TabsContent>
              <TabsContent value="system" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#f7d32e] text-black hover:bg-[#e6c41d] font-semibold"
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

