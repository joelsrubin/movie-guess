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
	year?: number
	rating?: number
}

export async function fetchRandomMovie(params: FetchMovieParams): Promise<Movie> {
	const { genres, yearStart, yearEnd, year, rating } = params

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
	})

	if (genreIds?.length) {
		const genreList = genreIds.join(",")
		apiParams.append("with_genres", encodeURIComponent(genreList))
	}

	if (rating) {
		const decimal = rating / 10
		apiParams.append("vote_average.gte", decimal.toString())
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

	const detailData = data.results[Math.floor(Math.random() * data.results.length)]

	const reverseGenreMap: Record<number, string> = Object.fromEntries(
		Object.entries(genreMap).map(([name, id]) => [id, name]),
	)

	if (!detailData.id) {
		throw new Error("Failed to fetch movie details")
	}

	return {
		title: detailData.title,
		year: new Date(detailData.release_date).getFullYear(),
		genres: detailData.genre_ids
			? detailData.genre_ids.map((id: number) => reverseGenreMap[id]).filter(Boolean)
			: [],
		id: detailData.id,
		imdb_id: detailData.imdb_id,
		poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
		blurb: detailData.overview,
	}
}
