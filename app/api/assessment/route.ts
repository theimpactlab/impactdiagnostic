import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const data = await req.json()
  const { organizationName, ...assessmentData } = data

  try {
    // First create the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: organizationName })
      .select()
      .single()

    if (orgError) throw orgError

    // Then create the assessment
    const { data: assessmentResult, error: assessmentError } = await supabase
      .from('assessments')
      .insert({ ...assessmentData, organization_id: orgData.id })
      .select()

    if (assessmentError) throw assessmentError

    return NextResponse.json({ success: true, data: assessmentResult })
  } catch (error) {
    console.error('Failed to save assessment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save assessment' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const organizationName = searchParams.get('organizationName')

  if (!organizationName) {
    return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })
  }

  try {
    // First get the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('name', organizationName)
      .single()

    if (orgError) throw orgError

    // Then get the assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('organization_id', orgData.id)
      .single()

    if (assessmentError) throw assessmentError

    if (!assessmentData) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    return NextResponse.json(assessmentData)
  } catch (error) {
    console.error('Failed to retrieve assessment:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve assessment' },
      { status: 500 }
    )
  }
}

