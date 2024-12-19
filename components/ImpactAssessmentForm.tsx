'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveAssessment, getAssessment } from '../lib/api'

export default function ImpactAssessmentForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    organizationName: '',
    leadImpactConsultant: '',
    researchConsultant: '',
    dataConsultant: '',
    // Add more fields for each section of the assessment
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await saveAssessment(formData)
      router.push('/results')
    } catch (error) {
      console.error('Failed to save assessment:', error)
    }
  }

  const handleLoad = async () => {
    try {
      const savedData = await getAssessment(formData.organizationName)
      if (savedData) {
        setFormData(savedData)
      }
    } catch (error) {
      console.error('Failed to load assessment:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Impact Diagnosis Assessment Tool</CardTitle>
        <CardDescription>Fill out the form to assess your organization's impact readiness</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {/* Add more input fields for other sections */}
          
          <div className="space-y-4">
            <Label htmlFor="alignmentScore">Purpose Alignment Score</Label>
            <Select
              name="alignmentScore"
              onValueChange={(value) => handleSelectChange('alignmentScore', value)}
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
          
          {/* Add more select fields for other sections */}
          
          <div className="flex justify-between">
            <Button type="button" onClick={handleLoad}>Load Saved Data</Button>
            <Button type="submit">Save and Generate Results</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

