import type { Metadata } from "next"
import { MovieRoulette } from "@/components/movie-roulette"
import { fetchMovieFromUrl } from "@/lib/api"
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
			const detailResponse = await fetch(`${BASE_URL}/movie/${params.movieId}?api_key=${API_KEY}`, {
				cache: "force-cache",
			})
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
	searchParams: Promise<{ [key: string]: string | undefined }>
}) {
	const params = await searchParams

	const movie = await fetchMovieFromUrl({ movieId: Number(params.movieId) })

	return (
		<>
			<MovieRoulette defaultData={movie} />
			<footer className="text-center text-sm text-muted-foreground">
				provider data sourced from JustWatch
			</footer>
		</>
	)
}
