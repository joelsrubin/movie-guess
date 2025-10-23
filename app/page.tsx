import type { Metadata } from "next"
import { MovieRoulette } from "@/components/movie-roulette"

const API_KEY = "57f535f358393665753c938201a145cb"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
	const params = await searchParams
	if (params.movieId) {
		try {
			const detailResponse = await fetch(
				`https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${API_KEY}`,
				{ cache: "force-cache" },
			)
			const detailData = await detailResponse.json()
			if (detailData.id) {
				const title = `Let's watch ${detailData.title}`
				const description = `Take it for a spin`
				const imageUrl = detailData.poster_path
					? `${TMDB_IMAGE_BASE}${detailData.poster_path}`
					: null

				return {
					openGraph: {
						title,
						description,
						images: imageUrl ? [imageUrl] : [],
					},
					twitter: {
						card: "summary_large_image",
						title,
						description,
						images: imageUrl ? [imageUrl] : [],
					},
				}
			}
		} catch (error) {
			console.error("Failed to fetch movie metadata:", error)
		}
	}
	return {
		title: "Movie Roulette",
		description: "Take it for a spin",
	}
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const params = await searchParams
	const fetchMovieFromUrl = async () => {
		if (params.movieId) {
			try {
				const detailResponse = await fetch(
					`https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${API_KEY}`,
					{ cache: "force-cache" },
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
