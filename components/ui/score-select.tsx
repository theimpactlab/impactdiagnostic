import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface ScoreSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  isAlignmentScore?: boolean;
}

export function ScoreSelect({ name, label, value, onChange, isAlignmentScore = false }: ScoreSelectProps) {
  const handleChange = (newValue: string) => {
    if (isAlignmentScore) {
      // Convert range to single digit score
      const numericValue = parseInt(newValue, 10);
      onChange(name, numericValue.toString());
    } else {
      onChange(name, newValue);
    }
  };

  const getDisplayValue = (value: string) => {
    if (isAlignmentScore) {
      const numericValue = parseInt(value, 10);
      const ranges = [
        '0-10', '11-20', '21-30', '31-40', '41-50',
        '51-60', '61-70', '71-80', '81-90', '91-100'
      ];
      return ranges[numericValue] || 'Select a score';
    }
    return value || 'Select a score';
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor={name} className="text-lg font-medium leading-none text-gray-900 flex-grow">
          {label}
        </Label>
        <div className="w-32">
          <Select
            value={value}
            onValueChange={handleChange}
          >
            <SelectTrigger id={name} className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <SelectValue placeholder="Select a score">
                {getDisplayValue(value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg rounded-md overflow-hidden">
              {isAlignmentScore ? (
                [...Array(10)].map((_, i) => (
                  <SelectItem 
                    key={i} 
                    value={i.toString()} 
                    className="cursor-pointer hover:bg-gray-100 bg-white py-2 px-4"
                  >
                    {`${i * 10 + 1}-${(i + 1) * 10}`}
                  </SelectItem>
                ))
              ) : (
                [...Array(11)].map((_, i) => (
                  <SelectItem 
                    key={i} 
                    value={i.toString()} 
                    className="cursor-pointer hover:bg-gray-100 bg-white py-2 px-4"
                  >
                    {i}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}

