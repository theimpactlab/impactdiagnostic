'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabase'

export default function NewAssessment() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    organizationName: '',
    leadImpactConsultant: '',
    researchConsultant: '',
    dataConsultant: '',
    alignmentScore: '',
    purposeStatementLength: '',
    purposeStatementCommonWords: '',
    purposeStatementUniqueness: '',
    purposeStatementClarity: '',
    purposeStatementFocus: '',
    impactLeadership: '',
    impactAppetite: '',
    impactDesire: '',
    impactCulture: '',
    impactBlockers: '',
    impactBuyIn: '',
    theoryOfChangeCompleteness: '',
    theoryOfChangeUse: '',
    theoryOfChangeWillingness: '',
    theoryOfChangeSimplicity: '',
    theoryOfChangeDefinitions: '',
    measurementFrameworkFeasibility: '',
    measurementFrameworkIndicators: '',
    measurementFrameworkOutcomes: '',
    measurementFrameworkValidation: '',
    measurementFrameworkComparison: '',
    measurementFrameworkDemographics: '',
    measurementFrameworkSegmentation: '',
    dataStructure: '',
    dataUniqueness: '',
    dataExpertise: '',
    dataCompleteness: '',
    dataQuality: '',
    dataConsistency: '',
    dataEffectiveness: '',
    dataAutomaticity: '',
    systemAppropriate: '',
    systemFitness: '',
    systemPersonnel: '',
    systemCustomization: '',
    systemConnectivity: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // First, create a new organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: formData.organizationName })
        .select()

      if (orgError) throw orgError

      // Then, create the assessment linked to the new organization
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .insert({ ...formData, organization_id: orgData[0].id })
        .select()

      if (assessmentError) throw assessmentError

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving assessment:', error)
      alert('Failed to save assessment. Please try again.')
    }
  }

  const renderSelect = (name: string, label: string) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        name={name}
        value={formData[name as keyof typeof formData]}
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Organization Details</h2>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadImpactConsultant">Lead Impact Consultant</Label>
                <Input
                  id="leadImpactConsultant"
                  name="leadImpactConsultant"
                  value={formData.leadImpactConsultant}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="researchConsultant">Research Consultant</Label>
                <Input
                  id="researchConsultant"
                  name="researchConsultant"
                  value={formData.researchConsultant}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataConsultant">Data Consultant</Label>
                <Input
                  id="dataConsultant"
                  name="dataConsultant"
                  value={formData.dataConsultant}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Purpose Alignment Tool Score</h2>
              {renderSelect('alignmentScore', "What was your team's alignment to purpose score?")}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Purpose Statement Assessment</h2>
              {renderSelect('purposeStatementLength', "To what extent is your purpose statement succinct?")}
              {renderSelect('purposeStatementCommonWords', "How prevalent are common words in your purpose statement?")}
              {renderSelect('purposeStatementUniqueness', "To what extent do you feel your purpose statement is unique to your organisation?")}
              {renderSelect('purposeStatementClarity', "How clear is your purpose statement?")}
              {renderSelect('purposeStatementFocus', "How focussed is your purpose statement?")}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Impact Leadership Assessment</h2>
              {renderSelect('impactLeadership', "To what extent would you agree that impact is led from the top of your organisation?")}
              {renderSelect('impactAppetite', "To what extent do you agree that people in your organisation are excited about delivering social impact?")}
              {renderSelect('impactDesire', "To what extent would you agree work around understanding and measuring impact has been successfully undertaken in the organisation?")}
              {renderSelect('impactCulture', "To what extent do you feel the organisation is willing to undertake further work around understanding and measuring impact?")}
              {renderSelect('impactBlockers', "To what extent would you agree that your organisation currently has a culture of understanding and measuring impact?")}
              {renderSelect('impactBuyIn', "How easy would it be to achieve buy-in from key people in your organisation to develop impact practices and measure them?")}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Theory of Change Assessment</h2>
              {renderSelect('theoryOfChangeCompleteness', "How complete do you believe your theory of change is?")}
              {renderSelect('theoryOfChangeUse', "To what extent is your theory of change used to drive the work of your organisation?")}
              {renderSelect('theoryOfChangeWillingness', "To what extent do you think your organisation would be willing to revisit your theory of change?")}
              {renderSelect('theoryOfChangeSimplicity', "To what extent do you agree that your theory of change is simple and straight forward?")}
              {renderSelect('theoryOfChangeDefinitions', "To what extent would you agree that the measures in your theory of change are measures of impact and not measures of reach?")}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Measurement Framework Assessment</h2>
              {renderSelect('measurementFrameworkFeasibility', "Is your framework feasible, cost effective, time efficient, resource appropriate and producing good quality, and reliable data?")}
              {renderSelect('measurementFrameworkIndicators', "To what extend do you feel you are measuring too many things?")}
              {renderSelect('measurementFrameworkOutcomes', "To what extent do you feel that you are collecting only output rather than outcome measures?")}
              {renderSelect('measurementFrameworkValidation', "To what extent do you believe your outcomes measures are based on validated scales?")}
              {renderSelect('measurementFrameworkComparison', "To what extent do you feel you can compare your organisations impact to others?")}
              {renderSelect('measurementFrameworkDemographics', "To what extent are you able to use demographic measures to assess your reaching your target population?")}
              {renderSelect('measurementFrameworkSegmentation', "To what extent are you using factors to interrogate your outcome measures by characteristic?")}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Data Assessment</h2>
              {renderSelect('dataStructure', "To what extent do you use defined and structured data fields rather than free text?")}
              {renderSelect('dataUniqueness', "To what extent are you able to use your data and systems to track participants over time?")}
              {renderSelect('dataExpertise', "To what extent would you describe your staff as 'data savvy'?")}
              {renderSelect('dataCompleteness', "How confident are you that you have complete and useful datasets collected from beneficiaries?")}
              {renderSelect('dataQuality', "To what extent is your data quality checked and maintained regularly?")}
              {renderSelect('dataConsistency', "Is data structure and format consistent over time?")}
              {renderSelect('dataEffectiveness', "To what extent do you believe your data is being effectively collected and reported on?")}
              {renderSelect('dataAutomaticity', "To what extent is your data capture automated and free from manual processes?")}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">System Assessment</h2>
              {renderSelect('systemAppropriate', "Is the number of systems being operated appropriate for the organisation?")}
              {renderSelect('systemFitness', "Are the systems modern and fit for purpose?")}
              {renderSelect('systemPersonnel', "Does the organisation have the appropriate personnel and support in place to run their systems?")}
              {renderSelect('systemCustomization', "Is it possible for the client to customise impact relevant systems without external support services?")}
              {renderSelect('systemConnectivity', "If applicable, Are your systems able interact with each other?")}
            </div>

            <Button type="submit" className="w-full bg-[#f7d32e] text-black hover:bg-[#e6c41d]">
              Submit Assessment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

