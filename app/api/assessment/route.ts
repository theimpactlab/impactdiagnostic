import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(req: Request) {
  const data = await req.json()
  const { organizationName, ...assessmentData } = data

  try {
    await kv.set(`assessment:${organizationName}`, JSON.stringify(assessmentData))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save assessment:', error)
    return NextResponse.json({ success: false, error: 'Failed to save assessment' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const organizationName = searchParams.get('organizationName')

  if (!organizationName) {
    return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })
  }

  try {
    const assessmentData = await kv.get(`assessment:${organizationName}`)
    if (!assessmentData) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }
    return NextResponse.json(assessmentData)
  } catch (error) {
    console.error('Failed to retrieve assessment:', error)
    return NextResponse.json({ error: 'Failed to retrieve assessment' }, { status: 500 })
  }
}

