import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { organizationName, ...assessmentData } = data

    // First create the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: organizationName })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      return NextResponse.json(
        { success: false, error: 'Failed to create organization' },
        { status: 500 }
      )
    }

    // Then create the assessment
    const { data: assessmentResult, error: assessmentError } = await supabase
      .from('assessments')
      .insert({ ...assessmentData, organization_id: orgData.id })
      .select()

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError)
      return NextResponse.json(
        { success: false, error: 'Failed to create assessment' },
        { status: 500 }
      )
    }

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
  try {
    const { searchParams } = new URL(req.url)
    const organizationName = searchParams.get('organizationName')

    if (!organizationName) {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      )
    }

    // First get the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('name', organizationName)
      .single()

    if (orgError) {
      console.error('Error fetching organization:', orgError)
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Then get the assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('organization_id', orgData.id)
      .single()

    if (assessmentError) {
      console.error('Error fetching assessment:', assessmentError)
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
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

