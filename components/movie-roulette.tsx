"use client"

import { Check, ListVideo, PartyPopper, Plus, Sparkles, X } from "lucide-react"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useEffect, useState } from "react"
import { allGenres, GenreFilters } from "@/components/genre-filters"
import { QueueModal } from "@/components/queue-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { QUEUE_STORAGE_KEY } from "@/lib/constants"
import Header from "./header"
import { SelectedMovie } from "./selected-movie"
import { ButtonGroup } from "./ui/button-group"
import { Spinner } from "./ui/spinner"
import { YearSlider } from "./year-slider"

export interface Movie {
	title: string
	year: number
	genres: string[]
	id: number
	poster: string
	imdb_id: string
}

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

export function MovieRoulette({ defaultData }: { defaultData: Movie | null }) {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(defaultData)
	const [isSpinning, setIsSpinning] = useState(false)
	const [params, setParams] = useQueryStates({
		genres: parseAsArrayOf(parseAsString).withDefault([]),
		year_start: parseAsInteger.withDefault(new Date().getFullYear()),
		year_end: parseAsInteger.withDefault(new Date().getFullYear()),
		movieId: parseAsInteger,
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
		setIsSpinning(true)

		const randomGenre =
			overrides.genre ||
			(params.genres.length > 0
				? params.genres[Math.floor(Math.random() * params.genres.length)]
				: null)

		let randomYear = overrides.year
		if (!randomYear && params.year_start && params.year_end) {
			const yearDiff = params.year_end - params.year_start
			randomYear = params.year_start + Math.floor(Math.random() * (yearDiff + 1))
		}
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
		}
	}

	const toggleGenre = (genre: string) => {
		if (params.genres.includes(genre)) {
			setParams({ genres: params.genres.filter((g) => g !== genre) })
		} else {
			setParams({ genres: [...params.genres, genre] })
		}
	}

	const handleRandom = () => {
		const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)]
		const randomYear = availableYears[Math.floor(Math.random() * availableYears.length)]
		setParams({
			genres: [randomGenre],
			year_start: randomYear,
			year_end: randomYear,
		})

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
										<SelectedMovie
											selectedMovie={selectedMovie}
											setIsSpinning={setIsSpinning}
											isSpinning={isSpinning}
										/>
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

									<div className="flex justify-center">
										<Button className="min-w-[155px]" variant="outline" onClick={handleRandom}>
											<PartyPopper className="size-5" />
											Random
										</Button>
									</div>
								</div>
							</Card>
						</div>
						<div className="space-y-6">
							<div className="text-center text-sm text-muted-foreground pt-4">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="text-sm text-muted-foreground">Active filters:</span>
									{params.genres.map((genre) => (
										<Badge
											key={genre}
											variant="default"
											className="gap-1.5 pr-1 cursor-pointer hover:bg-primary/80"
											onClick={() => toggleGenre(genre)}
										>
											{genre}
											<X className="size-3" />
										</Badge>
									))}
									{params.year_start && params.year_end && (
										<Badge variant="default" className="gap-1.5">
											{params.year_start === params.year_end
												? params.year_start
												: `${params.year_start}–${params.year_end}`}
										</Badge>
									)}
								</div>
							</div>
							{/* Genre Filters */}
							<GenreFilters
								selectedGenres={params.genres as string[]}
								onGenresChange={(genres) => setParams({ genres })}
							/>

							{/* Year Range Filter */}
							<YearSlider />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
