'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase'

interface AssessmentFormData {
  organizationName: string;
  lead_impact_consultant: string;
  research_consultant: string;
  data_consultant: string;
  alignment_score: number | null;
  purpose_statement_length: number | null;
  purpose_statement_common_words: number | null;
  purpose_statement_uniqueness: number | null;
  purpose_statement_clarity: number | null;
  purpose_statement_focus: number | null;
  impact_leadership: number | null;
  impact_appetite: number | null;
  impact_desire: number | null;
  impact_culture: number | null;
  impact_blockers: number | null;
  impact_buy_in: number | null;
  theory_of_change_completeness: number | null;
  theory_of_change_use: number | null;
  theory_of_change_willingness: number | null;
  theory_of_change_simplicity: number | null;
  theory_of_change_definitions: number | null;
  measurement_framework_feasibility: number | null;
  measurement_framework_indicators: number | null;
  measurement_framework_outcomes: number | null;
  measurement_framework_validation: number | null;
  measurement_framework_comparison: number | null;
  measurement_framework_demographics: number | null;
  measurement_framework_segmentation: number | null;
  data_structure: number | null;
  data_uniqueness: number | null;
  data_expertise: number | null;
  data_completeness: number | null;
  data_quality: null;
  data_consistency: number | null;
  data_effectiveness: number | null;
  data_automaticity: number | null;
  system_appropriate: number | null;
  system_fitness: number | null;
  system_personnel: number | null;
  system_customization: number | null;
  system_connectivity: number | null;
}

export default function AssessmentForm({ params }: { params: { orgId: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AssessmentFormData>({
    organizationName: '',
    lead_impact_consultant: '',
    research_consultant: '',
    data_consultant: '',
    alignment_score: null,
    purpose_statement_length: null,
    purpose_statement_common_words: null,
    purpose_statement_uniqueness: null,
    purpose_statement_clarity: null,
    purpose_statement_focus: null,
    impact_leadership: null,
    impact_appetite: null,
    impact_desire: null,
    impact_culture: null,
    impact_blockers: null,
    impact_buy_in: null,
    theory_of_change_completeness: null,
    theory_of_change_use: null,
    theory_of_change_willingness: null,
    theory_of_change_simplicity: null,
    theory_of_change_definitions: null,
    measurement_framework_feasibility: null,
    measurement_framework_indicators: null,
    measurement_framework_outcomes: null,
    measurement_framework_validation: null,
    measurement_framework_comparison: null,
    measurement_framework_demographics: null,
    measurement_framework_segmentation: null,
    data_structure: null,
    data_uniqueness: null,
    data_expertise: null,
    data_completeness: null,
    data_quality: null,
    data_consistency: null,
    data_effectiveness: null,
    data_automaticity: null,
    system_appropriate: null,
    system_fitness: null,
    system_personnel: null,
    system_customization: null,
    system_connectivity: null,
  })

  useEffect(() => {
    fetchAssessmentData()
  }, [params.orgId])

  async function fetchAssessmentData() {
    setIsLoading(true)
    setError(null)

    try {
      const orgId = parseInt(params.orgId, 10)
      if (isNaN(orgId)) {
        throw new Error('Invalid organization ID')
      }

      console.log('Fetching organization data for ID:', orgId)
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single()

      if (orgError) {
        console.error('Error fetching organization:', orgError)
        throw new Error(`Organization not found: ${orgError.message}`)
      }

      if (!orgData) {
        throw new Error('Organization not found')
      }

      console.log('Organization data:', orgData)

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('organization_id', orgId)
        .maybeSingle()

      if (assessmentError) {
        console.error('Error fetching assessment:', assessmentError)
        throw new Error(`Error fetching assessment data: ${assessmentError.message}`)
      }

      console.log('Assessment data:', assessmentData)

      setFormData({
        ...formData,
        organizationName: orgData.name,
        ...(assessmentData || {})
      })
    } catch (error) {
      console.error('Error in fetchAssessmentData:', error)
      setError(error instanceof Error ? error.message : 'Failed to load assessment data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: parseInt(value, 10) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      console.log('Submitting assessment for organization:', params.orgId)
      console.log('Form data:', formData)

      const assessmentData = {
        organization_id: parseInt(params.orgId, 10),
        lead_impact_consultant: formData.lead_impact_consultant,
        research_consultant: formData.research_consultant,
        data_consultant: formData.data_consultant,
        alignment_score: formData.alignment_score,
        purpose_statement_length: formData.purpose_statement_length,
        purpose_statement_common_words: formData.purpose_statement_common_words,
        purpose_statement_uniqueness: formData.purpose_statement_uniqueness,
        purpose_statement_clarity: formData.purpose_statement_clarity,
        purpose_statement_focus: formData.purpose_statement_focus,
        impact_leadership: formData.impact_leadership,
        impact_appetite: formData.impact_appetite,
        impact_desire: formData.impact_desire,
        impact_culture: formData.impact_culture,
        impact_blockers: formData.impact_blockers,
        impact_buy_in: formData.impact_buy_in,
        theory_of_change_completeness: formData.theory_of_change_completeness,
        theory_of_change_use: formData.theory_of_change_use,
        theory_of_change_willingness: formData.theory_of_change_willingness,
        theory_of_change_simplicity: formData.theory_of_change_simplicity,
        theory_of_change_definitions: formData.theory_of_change_definitions,
        measurement_framework_feasibility: formData.measurement_framework_feasibility,
        measurement_framework_indicators: formData.measurement_framework_indicators,
        measurement_framework_outcomes: formData.measurement_framework_outcomes,
        measurement_framework_validation: formData.measurement_framework_validation,
        measurement_framework_comparison: formData.measurement_framework_comparison,
        measurement_framework_demographics: formData.measurement_framework_demographics,
        measurement_framework_segmentation: formData.measurement_framework_segmentation,
        data_structure: formData.data_structure,
        data_uniqueness: formData.data_uniqueness,
        data_expertise: formData.data_expertise,
        data_completeness: formData.data_completeness,
        data_quality: formData.data_quality,
        data_consistency: formData.data_consistency,
        data_effectiveness: formData.data_effectiveness,
        data_automaticity: formData.data_automaticity,
        system_appropriate: formData.system_appropriate,
        system_fitness: formData.system_fitness,
        system_personnel: formData.system_personnel,
        system_customization: formData.system_customization,
        system_connectivity: formData.system_connectivity
      }

      console.log('Assessment data to be submitted:', assessmentData)

      const { data, error: submitError } = await supabase
        .from('assessments')
        .upsert(assessmentData, {
          onConflict: 'organization_id',
          ignoreDuplicates: false
        })
        .select()

      if (submitError) {
        console.error('Error submitting assessment:', submitError)
        throw new Error(`Failed to save assessment: ${submitError.message}`)
      }

      if (!data || data.length === 0) {
        console.error('No data returned after upsert')
        throw new Error('No data returned after saving assessment')
      }

      console.log('Assessment saved successfully:', data)
      
      // Fetch the saved data to confirm it's in the database
      const { data: savedData, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('organization_id', params.orgId)
        .single()

      if (fetchError) {
        console.error('Error fetching saved assessment:', fetchError)
        throw new Error('Failed to confirm assessment was saved')
      }

      console.log('Fetched saved assessment:', savedData)

      if (JSON.stringify(savedData) !== JSON.stringify(data[0])) {
        console.error('Saved data does not match submitted data')
        console.error('Saved data:', savedData)
        console.error('Submitted data:', data[0])
        throw new Error('Saved data does not match submitted data')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setError(error instanceof Error ? error.message : 'Failed to save assessment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSelect = (name: keyof AssessmentFormData, label: string) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        value={formData[name]?.toString() || ''}
        onValueChange={(value) => handleSelectChange(name, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a score" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(11)].map((_, i) => (
            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
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
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Impact Assessment Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="lead_impact_consultant">Lead Impact Consultant</Label>
            <Input
              id="lead_impact_consultant"
              name="lead_impact_consultant"
              value={formData.lead_impact_consultant}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="research_consultant">Research Consultant</Label>
            <Input
              id="research_consultant"
              name="research_consultant"
              value={formData.research_consultant}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_consultant">Data Consultant</Label>
            <Input
              id="data_consultant"
              name="data_consultant"
              value={formData.data_consultant}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Purpose Alignment Tool Score</h2>
            {renderSelect('alignment_score', "What was your team's alignment to purpose score?")}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Purpose Statement Assessment</h2>
            {renderSelect('purpose_statement_length', "To what extent is your purpose statement succinct?")}
            {renderSelect('purpose_statement_common_words', "How prevalent are common words in your purpose statement?")}
            {renderSelect('purpose_statement_uniqueness', "To what extent do you feel your purpose statement is unique to your organisation?")}
            {renderSelect('purpose_statement_clarity', "How clear is your purpose statement?")}
            {renderSelect('purpose_statement_focus', "How focussed is your purpose statement?")}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Impact Leadership Assessment</h2>
            {renderSelect('impact_leadership', "To what extent would you agree that impact is led from the top of your organisation?")}
            {renderSelect('impact_appetite', "To what extent do you agree that people in your organisation are excited about delivering social impact?")}
            {renderSelect('impact_desire', "To what extent would you agree work around understanding and measuring impact has been successfully undertaken in the organisation?")}
            {renderSelect('impact_culture', "To what extent do you feel the organisation is willing to undertake further work around understanding and measuring impact?")}
            {renderSelect('impact_blockers', "To what extent would you agree that your organisation currently has a culture of understanding and measuring impact?")}
            {renderSelect('impact_buy_in', "How easy would it be to achieve buy-in from key people in your organisation to develop impact practices and measure them?")}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Theory of Change Assessment</h2>
            {renderSelect('theory_of_change_completeness', "How complete do you believe your theory of change is?")}
            {renderSelect('theory_of_change_use', "To what extent is your theory of change used to drive the work of your organisation?")}
            {renderSelect('theory_of_change_willingness', "To what extent do you think your organisation would be willing to revisit your theory of change?")}
            {renderSelect('theory_of_change_simplicity', "To what extent do you agree that your theory of change is simple and straight forward?")}
            {renderSelect('theory_of_change_definitions', "To what extent would you agree that the measures in your theory of change are measures of impact and not measures of reach?")}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Measurement Framework Assessment</h2>
            {renderSelect('measurement_framework_feasibility', "Is your framework feasible, cost effective, time efficient, resource appropriate and producing good quality, and reliable data?")}
            {renderSelect('measurement_framework_indicators', "To what extent do you feel you are measuring too many things?")}
            {renderSelect('measurement_framework_outcomes', "To what extent do you feel that you are collecting only output rather than outcome measures?")}
            {renderSelect('measurement_framework_validation', "To what extent do you believe your outcomes measures are based on validated scales?")}
            {renderSelect('measurement_framework_comparison', "To what extent do you feel you can compare your organisations impact to others?")}
            {renderSelect('measurement_framework_demographics', "To what extent are you able to use demographic measures to assess your reaching your target population?")}
            {renderSelect('measurement_framework_segmentation', "To what extent are you using factors to interrogate your outcome measures by characteristic?")}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Data Assessment</h2>
            {renderSelect('data_structure', "To what extent do you use defined and structured data fields rather than free text?")}
            {renderSelect('data_uniqueness', "To what extent are you able to use your data and systems to track participants over time?")}
            {renderSelect('data_expertise', "To what extent would you describe your staff as 'data savvy'?")}
            {renderSelect('data_completeness', "How confident are you that you have complete and useful datasets collected from beneficiaries?")}
            {renderSelect('data_quality', "To what extent is your data quality checked and maintained regularly?")}
            {renderSelect('data_consistency', "Is data structure and format consistent over time?")}
            {renderSelect('data_effectiveness', "To what extent do you believe your data is being effectively collected and reported on?")}
            {renderSelect('data_automaticity', "To what extent is your data capture automated and free from manual processes?")}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">System Assessment</h2>
            {renderSelect('system_appropriate', "Is the number of systems being operated appropriate for the organisation?")}
            {renderSelect('system_fitness', "Are the systems modern and fit for purpose?")}
            {renderSelect('system_personnel', "Does the organisation have the appropriate personnel and support in place to run their systems?")}
            {renderSelect('system_customization', "Is it possible for the client to customise impact relevant systems without external support services?")}
            {renderSelect('system_connectivity', "If applicable, Are your systems able interact with each other?")}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#f7d32e] text-black hover:bg-[#e6c41d] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Assessment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

