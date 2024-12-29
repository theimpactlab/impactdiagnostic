import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface ScoreSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

export function ScoreSelect({ name, label, value, onChange }: ScoreSelectProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        <Label htmlFor={name} className="text-lg font-medium leading-none text-gray-900">
          {label}
        </Label>
        <Select
          value={value}
          onValueChange={(newValue) => onChange(name, newValue)}
        >
          <SelectTrigger id={name} className="w-full mt-2 bg-white border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <SelectValue placeholder="Select a score" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(11)].map((_, i) => (
              <SelectItem key={i} value={i.toString()} className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{i}</span>
                  <span className="text-sm text-gray-500">{getScoreDescription(i)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-2">
          {getScoreExplanation(parseInt(value))}
        </p>
      </div>
    </Card>
  )
}

function getScoreDescription(score: number): string {
  if (score <= 2) return "Needs significant improvement"
  if (score <= 4) return "Below average"
  if (score <= 6) return "Average"
  if (score <= 8) return "Good"
  return "Excellent"
}

function getScoreExplanation(score: number): string {
  if (score <= 2) return "This area requires immediate attention and substantial improvements."
  if (score <= 4) return "While there's some progress, this area still needs considerable work."
  if (score <= 6) return "You're on the right track, but there's room for enhancement."
  if (score <= 8) return "You're doing well in this area, with some minor improvements possible."
  if (score > 8) return "You're excelling in this area. Keep up the great work!"
  return "Select a score to see an explanation."
}

