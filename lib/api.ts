import type { Movie } from "@/components/movie-roulette"

const API_KEY = "57f535f358393665753c938201a145cb"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

const genreMap: Record<string, number> = {
	Action: 28,
	Adventure: 12,
	Animation: 16,
	Comedy: 35,
	Crime: 80,
	Drama: 18,
	Fantasy: 14,
	Horror: 27,
	Music: 10402,
	Mystery: 9648,
	Romance: 10749,
	"Sci-Fi": 878,
	Thriller: 53,
}

export interface FetchMovieParams {
	genres?: string[]
	yearStart?: number
	yearEnd?: number
	genre?: string
	year?: number
}

export async function fetchRandomMovie(params: FetchMovieParams): Promise<Movie> {
	const { genres, yearStart, yearEnd, genre, year } = params

	const randomGenre =
		genre ||
		(genres && genres.length > 0 ? genres[Math.floor(Math.random() * genres.length)] : null)

	let randomYear = year
	if (!randomYear && yearStart && yearEnd) {
		const yearDiff = yearEnd - yearStart
		randomYear = yearStart + Math.floor(Math.random() * (yearDiff + 1))
	}

	const genreId = randomGenre && randomGenre in genreMap ? genreMap[randomGenre] : null

	const apiParams = new URLSearchParams({
		api_key: API_KEY,
		sort_by: "popularity.desc",
	})

	if (genreId) {
		apiParams.append("with_genres", genreId.toString())
	}

	const currentYear = new Date().getFullYear()
	const startYear = 1940
	const availableYears = Array.from(
		{ length: currentYear - startYear + 1 },
		(_, i) => currentYear - i,
	)

	const yearToSearch =
		randomYear || availableYears[Math.floor(Math.random() * availableYears.length)]
	if (yearToSearch) {
		apiParams.append("primary_release_year", yearToSearch.toString())
	}

	const response = await fetch(
		`https://api.themoviedb.org/3/discover/movie?${apiParams.toString()}`,
	)
	const data = await response.json()

	if (!data.results || data.results.length === 0) {
		throw new Error("No movies found")
	}

	const randomMovie = data.results[Math.floor(Math.random() * data.results.length)]

	const detailResponse = await fetch(
		`https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${API_KEY}`,
	)
	const detailData = await detailResponse.json()

	if (!detailData.id) {
		throw new Error("Failed to fetch movie details")
	}

	return {
		title: detailData.title,
		year: new Date(detailData.release_date).getFullYear(),
		genres: detailData.genres ? detailData.genres.map((g: { name: string }) => g.name) : [],
		id: detailData.id,
		imdb_id: detailData.imdb_id,
		poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
	}
}

export async function fetchMovieById(movieId: number): Promise<Movie> {
	const detailResponse = await fetch(
		`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`,
		{ cache: "force-cache" },
	)
	const detailData = await detailResponse.json()

	if (!detailData.id) {
		throw new Error("Movie not found")
	}

	return {
		title: detailData.title,
		year: new Date(detailData.release_date).getFullYear(),
		genres: detailData.genres ? detailData.genres.map((g: { name: string }) => g.name) : [],
		id: detailData.id,
		imdb_id: detailData.imdb_id,
		poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
	}
}
