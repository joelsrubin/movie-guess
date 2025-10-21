"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Film, Sparkles } from "lucide-react"
import { GenreFilters } from "@/components/genre-filters"

const movies = [
  { title: "The Shawshank Redemption", year: 1994, genres: ["Drama", "Crime"] },
  { title: "The Godfather", year: 1972, genres: ["Drama", "Crime"] },
  { title: "The Dark Knight", year: 2008, genres: ["Action", "Crime", "Drama"] },
  { title: "Pulp Fiction", year: 1994, genres: ["Crime", "Drama"] },
  { title: "Forrest Gump", year: 1994, genres: ["Drama", "Romance"] },
  { title: "Inception", year: 2010, genres: ["Action", "Sci-Fi", "Thriller"] },
  { title: "The Matrix", year: 1999, genres: ["Action", "Sci-Fi"] },
  { title: "Goodfellas", year: 1990, genres: ["Crime", "Drama"] },
  { title: "The Silence of the Lambs", year: 1991, genres: ["Crime", "Drama", "Thriller"] },
  { title: "Interstellar", year: 2014, genres: ["Adventure", "Drama", "Sci-Fi"] },
  { title: "Parasite", year: 2019, genres: ["Drama", "Thriller"] },
  { title: "Spirited Away", year: 2001, genres: ["Animation", "Adventure", "Fantasy"] },
  { title: "The Prestige", year: 2006, genres: ["Drama", "Mystery", "Thriller"] },
  { title: "Whiplash", year: 2014, genres: ["Drama", "Music"] },
  { title: "Gladiator", year: 2000, genres: ["Action", "Adventure", "Drama"] },
  { title: "The Departed", year: 2006, genres: ["Crime", "Drama", "Thriller"] },
  { title: "The Lion King", year: 1994, genres: ["Animation", "Adventure", "Drama"] },
  { title: "Back to the Future", year: 1985, genres: ["Adventure", "Comedy", "Sci-Fi"] },
  { title: "Alien", year: 1979, genres: ["Horror", "Sci-Fi"] },
  { title: "The Shining", year: 1980, genres: ["Drama", "Horror"] },
  { title: "Toy Story", year: 1995, genres: ["Animation", "Adventure", "Comedy"] },
  { title: "Jurassic Park", year: 1993, genres: ["Action", "Adventure", "Sci-Fi"] },
  { title: "The Truman Show", year: 1998, genres: ["Comedy", "Drama", "Sci-Fi"] },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004, genres: ["Drama", "Romance", "Sci-Fi"] },
  { title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure", "Sci-Fi"] },
]

export function MovieRoulette() {
  const [selectedMovie, setSelectedMovie] = useState<(typeof movies)[0] | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const handleSpin = () => {
    setIsSpinning(true)
    setSelectedMovie(null)

    // Filter movies by selected genres
    const filteredMovies =
      selectedGenres.length > 0
        ? movies.filter((movie) => selectedGenres.some((genre) => movie.genres.includes(genre)))
        : movies

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
              {selectedGenres.length > 0
                ? `Filtering by: ${selectedGenres.join(", ")}`
                : "Select genres above to filter your movie selection"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
