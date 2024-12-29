import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ScoreSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

export function ScoreSelect({ name, label, value, onChange }: ScoreSelectProps) {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(name, value)}
      >
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder="Select a score" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(11)].map((_, i) => (
            <SelectItem key={i} value={i.toString()}>
              {i} - {getScoreDescription(i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function getScoreDescription(score: number): string {
  if (score <= 3) return "Needs significant improvement"
  if (score <= 5) return "Below average"
  if (score <= 7) return "Average"
  if (score <= 9) return "Good"
  return "Excellent"
}

