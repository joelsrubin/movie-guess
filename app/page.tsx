import { MovieRoulette } from "@/components/movie-roulette"

interface Movie {
  title: string
  year: number
  genres: string[]
  imdbId: string
  poster: string
}

async function getMovies(): Promise<Movie[]> {
  const API_KEY = "d176ea9a"
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 5
  const allMovies: Movie[] = []

  for (let year = startYear; year <= currentYear; year++) {
    for (let page = 1; page <= 10; page++) {
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=movie&type=movie&y=${year}&page=${page}`
        )
        const data = await response.json()

        if (data.Response === "True" && data.Search) {
          const movieDetailsPromises = data.Search.map(async (movie: any) => {
            try {
              const detailResponse = await fetch(
                `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
              )
              const detailData = await detailResponse.json()

              if (detailData.Response === "True") {
                return {
                  title: detailData.Title,
                  year: parseInt(detailData.Year),
                  genres: detailData.Genre ? detailData.Genre.split(", ") : [],
                  imdbId: detailData.imdbID,
                }
              }
              return null
            } catch (error) {
              console.error(`Failed to fetch details for ${movie.imdbID}:`, error)
              return null
            }
          })

          const movies = await Promise.all(movieDetailsPromises)
          allMovies.push(...movies.filter((movie): movie is Movie => movie !== null))
        } else {
          break
        }
      } catch (error) {
        console.error(`Failed to fetch movies for year ${year}, page ${page}:`, error)
      }
    }
  }

  return allMovies
}

export default async function Home() {
  const movies = await getMovies()
  console.log({movies})
  return <MovieRoulette movies={movies} />
}
