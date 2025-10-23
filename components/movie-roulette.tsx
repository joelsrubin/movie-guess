"use client"

import { Check, ListVideo, PartyPopper, Plus, Sparkles, Trash } from "lucide-react"
import Image from "next/image"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useEffect, useState } from "react"
import { allGenres, GenreFilters } from "@/components/genre-filters"
import { QueueModal } from "@/components/queue-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { YearFilter } from "@/components/year-filter"
import Header from "./header"
import { NoImage } from "./no-image"
import { ButtonGroup } from "./ui/button-group"
import { Spinner } from "./ui/spinner"

interface Movie {
	title: string
	year: number
	genres: string[]
	id: number
	poster: string
	imdb_id: string
}

const API_KEY = "57f535f358393665753c938201a145cb"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"
const QUEUE_STORAGE_KEY = "movie-roulette-queue"

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

export function MovieRoulette({ defaultData }: { defaultData: Movie | null }) {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(defaultData)
	const [isSpinning, setIsSpinning] = useState(false)
	const [params, setParams] = useQueryStates({
		genres: parseAsArrayOf(parseAsString).withDefault([]),
		years: parseAsArrayOf(parseAsInteger).withDefault([]),
		movieId: parseAsInteger,
	})
	const [errors, setErrors] = useState<{ genre: string; year: string }>({
		genre: "",
		year: "",
	})
	const [queue, setQueue] = useState<Movie[]>([])
	const [isLoadingQueue, setIsLoadingQueue] = useState(true)

	const currentYear = new Date().getFullYear()
	const startYear = 1940
	const availableYears = Array.from(
		{ length: currentYear - startYear + 1 },
		(_, i) => currentYear - i,
	)

	useEffect(() => {
		const loadQueue = () => {
			try {
				const stored = localStorage.getItem(QUEUE_STORAGE_KEY)
				if (stored) {
					setQueue(JSON.parse(stored))
				}
			} catch (error) {
				console.error("Failed to load queue from localStorage:", error)
			} finally {
				setIsLoadingQueue(false)
			}
		}
		loadQueue()
	}, [])

	const handleAddToQueue = () => {
		if (selectedMovie && !queue.find((m) => m.id === selectedMovie.id)) {
			const updated = [...queue, selectedMovie]
			setQueue(updated)
			localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updated))
		}
	}

	const handleRemoveFromQueue = (movieId: number) => {
		const updated = queue.filter((m) => m.id !== movieId)
		setQueue(updated)
		localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updated))
	}

	const handleSpin = async (overrides: { genre?: string; year?: number } = {}) => {
		if (
			!overrides.genre &&
			params.genres.length === 0 &&
			!overrides.year &&
			params.years.length === 0
		) {
			setErrors({
				genre: "Please select at least one genre or year",
				year: "",
			})
			return
		}

		setIsSpinning(true)

		const randomGenre =
			overrides.genre ||
			(params.genres.length > 0
				? params.genres[Math.floor(Math.random() * params.genres.length)]
				: null)
		const randomYear =
			overrides.year ||
			(params.years.length > 0
				? params.years[Math.floor(Math.random() * params.years.length)]
				: null)
		const genreId = randomGenre && randomGenre in genreMap ? genreMap[randomGenre] : null

		try {
			const apiParams = new URLSearchParams({
				api_key: API_KEY,
				sort_by: "popularity.desc",
			})

			if (genreId) {
				apiParams.append("with_genres", genreId.toString())
			}

			const yearToSearch =
				randomYear || availableYears[Math.floor(Math.random() * availableYears.length)]
			if (yearToSearch) {
				apiParams.append("primary_release_year", yearToSearch.toString())
			}

			const response = await fetch(
				`https://api.themoviedb.org/3/discover/movie?${apiParams.toString()}`,
			)
			const data = await response.json()

			if (data.results && data.results.length > 0) {
				const randomMovie = data.results[Math.floor(Math.random() * data.results.length)]

				const detailResponse = await fetch(
					`https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${API_KEY}`,
				)
				const detailData = await detailResponse.json()
				console.log({ detailData })
				if (detailData.id) {
					const movie = {
						title: detailData.title,
						year: new Date(detailData.release_date).getFullYear(),
						genres: detailData.genres ? detailData.genres.map((g: { name: string }) => g.name) : [],
						id: detailData.id,
						imdb_id: detailData.imdb_id,
						poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
					}
					setSelectedMovie(movie)
					setParams({ movieId: detailData.id })

					if (!detailData.poster_path) {
						setIsSpinning(false)
					}
				}
			}
		} catch (_error) {
			console.error("Failed to fetch movie:", _error)
			setIsSpinning(false)
			setErrors({
				genre: "",
				year: "Failed to fetch movie. Please try again.",
			})
		}
	}

	const clearFilters = () => {
		setParams({ genres: [], years: [], movieId: null })
		setErrors({ genre: "", year: "" })
	}

	const handleRandom = () => {
		setErrors({ genre: "", year: "" })
		const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)]
		const randomYear = availableYears[Math.floor(Math.random() * availableYears.length)]
		setParams({ genres: [randomGenre], years: [randomYear] })
		handleSpin({ genre: randomGenre, year: randomYear })
	}
	return (
		<>
			<Header
				queueButton={
					<QueueModal
						movies={queue}
						onRemove={handleRemoveFromQueue}
						trigger={
							<Button variant="outline">
								<ListVideo className="w-5 h-5 mr-2" />
								Queue
								{isLoadingQueue ? (
									<Spinner />
								) : (
									queue.length > 0 && (
										<Badge className="ml-2 px-2 py-0.5 text-xs">{queue.length}</Badge>
									)
								)}
							</Button>
						}
					/>
				}
			/>
			<div className="container">
				<div className="mx-auto px-4 py-2">
					<div className="max-w-4xl mx-auto ">
						<div className="flex justify-center items-center pt-4">
							<Card className="w-full max-w-sm md:max-w-lg">
								<div className="space-y-8">
									<div className="min-h-[200px] flex items-center justify-center">
										{selectedMovie ? (
											<div className="text-center space-y-4 animate-in fade-in duration-300">
												{selectedMovie.poster ? (
													<div className="flex justify-center pb-8">
														<a
															href={`https://www.imdb.com/title/${selectedMovie.imdb_id}`}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-2 text-primary hover:underline"
														>
															<Image
																width={500}
																height={750}
																onError={() => setIsSpinning(false)}
																onLoad={() => setIsSpinning(false)}
																src={selectedMovie.poster}
																alt={`${selectedMovie.title} poster`}
																className={` max-h-[400px] object-contain transition-all ${isSpinning ? "blur-sm" : ""}`}
															/>
														</a>
													</div>
												) : (
													<NoImage />
												)}
												<h2 className="text-3xl md:text-5xl font-bold text-balance">
													{selectedMovie.title}
												</h2>
												<p className="text-xl md:text-2xl text-muted-foreground">
													{selectedMovie.year}
												</p>
												<div className="flex flex-wrap gap-2 justify-center">
													{selectedMovie.genres.map((genre) => (
														<Badge key={genre} variant="outline" className="text-sm px-3 py-1">
															{genre}
														</Badge>
													))}
												</div>
											</div>
										) : (
											<NoImage variant="default" />
										)}
									</div>

									<div className="flex justify-center">
										<ButtonGroup>
											<Button
												onClick={handleAddToQueue}
												className="min-w-[155px]"
												disabled={!selectedMovie || queue.some((m) => m.id === selectedMovie?.id)}
											>
												{queue.some((m) => m.id === selectedMovie?.id) ? (
													<Check className="size-5" />
												) : (
													<Plus className="size-5" />
												)}
												{queue.some((m) => m.id === selectedMovie?.id)
													? "Added to Queue"
													: "Add to Queue"}
											</Button>
											<Button
												variant="outline"
												onClick={() => handleSpin({})}
												disabled={isSpinning}
												className="min-w-[155px]"
											>
												<Sparkles className={`size-5 ${isSpinning ? "animate-spin" : ""}`} />
												{isSpinning ? "Spinning..." : "Spin the Wheel"}
											</Button>
										</ButtonGroup>
									</div>
									{errors.genre && (
										<p className="flex justify-center text-red-500 text-sm mt-2">{errors.genre}</p>
									)}
									<div className="flex justify-center">
										<ButtonGroup>
											<Button
												disabled={params.genres.length === 0 && params.years.length === 0}
												variant="destructive"
												onClick={clearFilters}
												className="min-w-[155px]"
											>
												<Trash className="size-5" />
												Clear filters
											</Button>
											<Button className="min-w-[155px]" variant="outline" onClick={handleRandom}>
												<PartyPopper className="size-5" />
												Random
											</Button>
										</ButtonGroup>
									</div>
								</div>
							</Card>
						</div>
						<div className="text-center text-sm text-muted-foreground pt-4">
							<p>
								{params.genres.length > 0 || params.years.length > 0
									? `Filtering by: ${[
											params.genres.length > 0 ? `Genres: ${params.genres.join(", ")}` : "",
											params.years.length > 0 ? `Years: ${params.years.join(", ")}` : "",
										]
											.filter(Boolean)
											.join(" | ")}`
									: "Select genres or years above to filter your movie selection"}
							</p>
						</div>
						<GenreFilters
							setErrors={setErrors}
							selectedGenres={params.genres as string[]}
							onGenresChange={(genres) => setParams({ genres })}
						/>

						<YearFilter
							setErrors={setErrors}
							availableYears={availableYears}
							selectedYears={params.years as number[]}
							onYearsChange={(years) => setParams({ years })}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
