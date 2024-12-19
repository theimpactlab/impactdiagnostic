'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase'

export default function AssessmentForm({ params }: { params: { orgId: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    organizationName: '',
    leadImpactConsultant: '',
    researchConsultant: '',
    dataConsultant: '',
    alignmentScore: '',
    // Add more fields for each section of the assessment
  })

  useEffect(() => {
    fetchAssessmentData()
  }, [params.orgId])

  async function fetchAssessmentData() {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('organization_id', params.orgId)
      .single()

    if (error) {
      console.error('Error fetching assessment data:', error)
    } else if (data) {
      setFormData(data)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('assessments')
      .upsert({ ...formData, organization_id: params.orgId })
      .select()

    if (error) {
      console.error('Error saving assessment:', error)
    } else {
      router.push('/dashboard')
    }
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

          <div className="space-y-2">
            <Label htmlFor="alignmentScore">Purpose Alignment Score</Label>
            <Select
              name="alignmentScore"
              value={formData.alignmentScore}
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

          {/* Add more form fields for other sections */}

          <Button type="submit">Save Assessment</Button>
        </form>
      </CardContent>
    </Card>
  )
}

