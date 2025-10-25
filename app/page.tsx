import type { Metadata } from "next"
import { MovieRoulette } from "@/components/movie-roulette"
import { API_KEY, BASE_URL, TMDB_IMAGE_BASE } from "@/lib/constants"

export type WatchProviders = { logo: string; name: string; id: string }[]
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
	const defaultImageUrl = "/og-image.png"
	return {
		title: "Movie Roulette",
		description: "Take it for a spin",
		openGraph: {
			images: [defaultImageUrl],
		},
		twitter: {
			card: "summary_large_image",
			images: [defaultImageUrl],
		},
	}
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const params = await searchParams
	const fetchProviders = async (): Promise<WatchProviders> => {
		const url = `${BASE_URL}/watch/providers/movie?language=en-US&watch_region=US&api_key=${API_KEY}`
		const providersResponse = await fetch(url)

		const providersData = await providersResponse.json()
		const formatted = providersData.results
			.slice(0, 100)
			.map((p: { logo_path: string; provider_name: string; provider_id: string }) => ({
				logo: p.logo_path,
				name: p.provider_name,
				id: p.provider_id.toString(),
			}))
		return formatted
	}
	const fetchMovieFromUrl = async () => {
		if (params.movieId) {
			try {
				const detailResponse = await fetch(
					`${BASE_URL}/movie/${params.movieId}?api_key=${API_KEY}`,
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
	const movie = await fetchMovieFromUrl()
	// const providers = await fetchProviders()

	return (
		<>
			<MovieRoulette defaultData={movie} />
			<footer className="text-center text-sm text-muted-foreground">
				provider data sourced from JustWatch
			</footer>
		</>
	)
}
