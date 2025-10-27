import type { Movie } from "@/components/movie-roulette"
import { BASE_URL } from "./constants"

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
	year?: number
	providers?: string[]
}

export async function fetchRandomMovie(params: FetchMovieParams): Promise<Movie> {
	const { genres, yearStart, yearEnd, year, providers } = params

	let randomYear = year
	if (!randomYear && yearStart && yearEnd) {
		const yearDiff = yearEnd - yearStart
		randomYear = yearStart + Math.floor(Math.random() * (yearDiff + 1))
	}

	const genreIds = genres?.map((g) => genreMap[g])

	const apiParams = new URLSearchParams({
		api_key: API_KEY,
		sort_by: "popularity.desc",
		include_adult: "false",
		with_origin_country: "US",
		watch_region: "US",
	})

	if (genreIds?.length) {
		const genreList = genreIds.join(",")
		apiParams.append("with_genres", encodeURIComponent(genreList))
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

	if (providers?.length) {
		const providerList = providers.join("|")
		const encoded = encodeURIComponent(providerList)
		apiParams.append("with_watch_providers", encoded)
	}

	const response = await fetch(
		`https://api.themoviedb.org/3/discover/movie?${apiParams.toString()}`,
	)
	const data = await response.json()

	if (!data.results || data.results.length === 0) {
		throw new Error("No movies found")
	}

	const detailData = data.results[Math.floor(Math.random() * data.results.length)]

	if (!detailData.id) {
		throw new Error("Failed to fetch movie details")
	}

	const deeperObj = await fetchMovieFromUrl({ movieId: detailData.id })
	if (!deeperObj) {
		throw new Error("Failed to fetch movie details")
	}
	return deeperObj
}

export const fetchMovieFromUrl = async ({ movieId }: { movieId?: number }) => {
	if (movieId) {
		try {
			const detailResponse = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`, {
				cache: "force-cache",
			})
			const detailData = await detailResponse.json()
			console.log({ detailData })
			if (detailData.id) {
				return {
					title: detailData.title,
					year: new Date(detailData.release_date).getFullYear(),
					genres: detailData.genres ? detailData.genres.map((g: { name: string }) => g.name) : [],
					id: detailData.id,
					imdb_id: detailData.imdb_id,
					poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
					blurb: detailData.overview,
				}
			}
			return null
		} catch (error) {
			console.error("Failed to fetch movie from URL:", error)
		}
	}
	return null
}
