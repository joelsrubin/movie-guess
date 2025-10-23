import { MovieRoulette } from "@/components/movie-roulette"

const API_KEY = "57f535f358393665753c938201a145cb"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

export default async function Home({ searchParams }: { searchParams: { movieId: string } }) {
	const fetchMovieFromUrl = async () => {
		if (searchParams.movieId) {
			try {
				const detailResponse = await fetch(
					`https://api.themoviedb.org/3/movie/${searchParams.movieId}?api_key=${API_KEY}`,
				)
				const detailData = await detailResponse.json()
				if (detailData.id) {
					return {
						title: detailData.title,
						year: new Date(detailData.release_date).getFullYear(),
						genres: detailData.genres ? detailData.genres.map((g: { name: string }) => g.name) : [],
						id: detailData.id,
						imdb_id: detailData.imdb_id,
						poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
					}
				}
				return null
			} catch (error) {
				console.error("Failed to fetch movie from URL:", error)
			}
		}
		return null
	}
	const movie = await fetchMovieFromUrl()

	return <MovieRoulette defaultData={movie} />
}
