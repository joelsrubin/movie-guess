"use client"

import { useState, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Film, Sparkles, ExternalLink } from "lucide-react"
import { GenreFilters } from "@/components/genre-filters"
import { YearFilter } from "@/components/year-filter"

interface Movie {
  title: string
  year: number
  genres: string[]
  imdbId: string
  poster: string
}

interface MovieRouletteProps {
  movies: Movie[]
}

export function MovieRoulette({ movies }: MovieRouletteProps) {
  const [selectedMovie, setSelectedMovie] = useState<(typeof movies)[0] | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])

  const availableYears = useMemo(() => {
    const years = [...new Set(movies.map((movie) => movie.year))]
    return years.sort((a, b) => b - a)
  }, [movies])

  const handleSpin = () => {
    setIsSpinning(true)
    setSelectedMovie(null)

    let filteredMovies = movies

    if (selectedGenres.length > 0) {
      filteredMovies = filteredMovies.filter((movie) =>
        selectedGenres.some((genre) => movie.genres.includes(genre))
      )
    }

    if (selectedYears.length > 0) {
      filteredMovies = filteredMovies.filter((movie) => selectedYears.includes(movie.year))
    }

    if (filteredMovies.length === 0) {
      setIsSpinning(false)
      return
    }

    // Simulate spinning animation
    let counter = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredMovies.length)
      setSelectedMovie(filteredMovies[randomIndex])
      counter++

      if (counter > 15) {
        clearInterval(interval)
        setIsSpinning(false)
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Film className="w-10 h-10 text-accent" />
              <h1 className="text-4xl md:text-6xl font-bold text-balance">Movie Roulette</h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Can't decide what to watch? Let fate choose your next movie adventure.
            </p>
          </div>

          {/* Genre Filters */}
          <GenreFilters selectedGenres={selectedGenres} onGenresChange={setSelectedGenres} />

          {/* Year Filter */}
          <YearFilter 
            availableYears={availableYears}
            selectedYears={selectedYears}
            onYearsChange={setSelectedYears}
          />

          {/* Movie Display Card */}
          <Card className="p-8 md:p-12 bg-card border-2 shadow-lg">
            <div className="space-y-8">
              <div className="min-h-[200px] flex items-center justify-center">
                {selectedMovie ? (
                  <div className="text-center space-y-4 animate-in fade-in duration-300">


                    <h2 className="text-3xl md:text-5xl font-bold text-balance">{selectedMovie.title}</h2>
                    <p className="text-xl md:text-2xl text-muted-foreground">{selectedMovie.year}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedMovie.genres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-sm px-3 py-1">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href={`https://www.imdb.com/title/${selectedMovie.imdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
                    >
                      View on IMDb <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Film className="w-20 h-20 mx-auto text-muted-foreground/30" />
                    <p className="text-xl text-muted-foreground">
                      {selectedGenres.length > 0
                        ? "Ready to spin with your selected genres!"
                        : "Press the button to discover your movie"}
                    </p>
                  </div>
                )}
              </div>

              {/* Spin Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className={`w-5 h-5 mr-2 ${isSpinning ? "animate-spin" : ""}`} />
                  {isSpinning ? "Spinning..." : "Spin the Roulette"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Info Section */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {selectedGenres.length > 0 || selectedYears.length > 0
                ? `Filtering by: ${[
                    selectedGenres.length > 0 ? `Genres: ${selectedGenres.join(", ")}` : "",
                    selectedYears.length > 0 ? `Years: ${selectedYears.join(", ")}` : "",
                  ]
                    .filter(Boolean)
                    .join(" | ")}`
                : "Select genres or years above to filter your movie selection"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
