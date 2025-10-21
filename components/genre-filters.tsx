"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const allGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
]

interface GenreFiltersProps {
  selectedGenres: string[]
  onGenresChange: (genres: string[]) => void
}

export function GenreFilters({ selectedGenres, onGenresChange }: GenreFiltersProps) {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter((g) => g !== genre))
    } else {
      onGenresChange([...selectedGenres, genre])
    }
  }

  const clearAll = () => {
    onGenresChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter by Genre</h3>
        {selectedGenres.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre)
          return (
            <Badge
              key={genre}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-secondary"
              }`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
