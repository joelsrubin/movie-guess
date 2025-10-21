"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface YearFilterProps {
  availableYears: number[]
  selectedYears: number[]
  onYearsChange: (years: number[]) => void
  error: string
  setErrors: React.Dispatch<React.SetStateAction<{ genre: string; year: string }>>
}

export function YearFilter({ availableYears, selectedYears, onYearsChange, error, setErrors }: YearFilterProps) {
  const toggleYear = (year: number) => {
    setErrors((prev) => ({ ...prev, year: "" }))
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter((y) => y !== year))
    } else {
      onYearsChange([...selectedYears, year])
    }
  }

  const clearAll = () => {
    onYearsChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter by Year</h3>
        {selectedYears.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableYears.map((year) => {
          const isSelected = selectedYears.includes(year)
          return (
            <Badge
              key={year}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-secondary"
              }`}
              onClick={() => toggleYear(year)}
            >
              {year}
            </Badge>
          )
        })}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
