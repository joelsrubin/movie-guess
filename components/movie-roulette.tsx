"use client"

import { useState } from "react"
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

const API_KEY = "d95ad1f7"

export function MovieRoulette() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])

  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 5
  const availableYears = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i)

  const handleSpin = async () => {
    if (selectedGenres.length === 0 || selectedYears.length === 0) {
      alert("Please select at least one genre and one year")
      return
    }

    setIsSpinning(true)
    setSelectedMovie(null)

    const randomGenre = selectedGenres[Math.floor(Math.random() * selectedGenres.length)]
    const randomYear = selectedYears[Math.floor(Math.random() * selectedYears.length)]

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${randomGenre}&type=movie&y=${randomYear}`
      )
      const data = await response.json()

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        const randomMovie = data.Search[Math.floor(Math.random() * data.Search.length)]

        const detailResponse = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${randomMovie.imdbID}`
        )
        const detailData = await detailResponse.json()

        if (detailData.Response === "True") {
          let counter = 0
          const interval = setInterval(() => {
            if (counter < 15) {
              setSelectedMovie({
                title: detailData.Title,
                year: parseInt(detailData.Year),
                genres: detailData.Genre ? detailData.Genre.split(", ") : [],
                imdbId: detailData.imdbID,
                poster: detailData.Poster !== "N/A" ? detailData.Poster : "",
              })
              counter++
            } else {
              clearInterval(interval)
              setIsSpinning(false)
            }
          }, 100)
        } else {
          setIsSpinning(false)
          alert("No movie found with the selected filters")
        }
      } else {
        setIsSpinning(false)
        alert("No movies found with the selected filters. Try different combinations.")
      }
    } catch (error) {
      console.error("Failed to fetch movie:", error)
      setIsSpinning(false)
      alert("Failed to fetch movie. Please try again.")
    }
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
                    {selectedMovie.poster && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={selectedMovie.poster}
                          alt={`${selectedMovie.title} poster`}
                          className="rounded-lg shadow-lg max-h-[400px] object-cover"
                        />
                      </div>
                    )}
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
                      {selectedGenres.length > 0 && selectedYears.length > 0
                        ? "Ready to spin with your selected filters!"
                        : "Select at least one genre and one year to start"}
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
