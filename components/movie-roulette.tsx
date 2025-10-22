"use client"

import { Check, Film, ListVideo, Loader2, PartyPopper, Plus, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { allGenres, GenreFilters } from "@/components/genre-filters"
import { QueueModal } from "@/components/queue-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { YearFilter } from "@/components/year-filter"
import Header from "./header"
import { ButtonGroup } from "./ui/button-group"

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

export function MovieRoulette() {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
	const [isSpinning, setIsSpinning] = useState(false)
	const [selectedGenres, setSelectedGenres] = useState<string[]>([])
	const [selectedYears, setSelectedYears] = useState<number[]>([])
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
			(!overrides.genre && selectedGenres.length === 0) ||
			(!overrides.year && selectedYears.length === 0)
		) {
			setErrors({
				genre: selectedGenres.length === 0 ? "Please select at least one genre" : "",
				year: selectedYears.length === 0 ? "Please select at least one year" : "",
			})
			return
		}

		setIsSpinning(true)

		const randomGenre =
			overrides.genre || selectedGenres[Math.floor(Math.random() * selectedGenres.length)]
		const randomYear =
			overrides.year || selectedYears[Math.floor(Math.random() * selectedYears.length)]
		const genreId = genreMap[randomGenre]

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&primary_release_year=${randomYear}&sort_by=popularity.desc`,
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
					setSelectedMovie({
						title: detailData.title,
						year: new Date(detailData.release_date).getFullYear(),
						genres: detailData.genres ? detailData.genres.map((g: { name: string }) => g.name) : [],
						id: detailData.id,
						imdb_id: detailData.imdb_id,
						poster: detailData.poster_path ? `${TMDB_IMAGE_BASE}${detailData.poster_path}` : "",
					})
					setIsSpinning(false)
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

	const handleRandom = () => {
		const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)]
		setSelectedGenres([randomGenre])
		const randomYear = availableYears[Math.floor(Math.random() * availableYears.length)]
		setSelectedYears([randomYear])
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
									<Loader2 className="ml-2 w-4 h-4 animate-spin text-muted-foreground" />
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
						{/* Genre Filters */}

						{/* Movie Display Card */}
						<div className="flex justify-center items-center">
							<Card className="w-full max-w-sm md:max-w-lg">
								<div className="space-y-8">
									<div className="min-h-[200px] flex items-center justify-center">
										{selectedMovie ? (
											<div className="text-center space-y-4 animate-in fade-in duration-300">
												{selectedMovie.poster && (
													<div className="flex justify-center mb-4">
														<a
															href={`https://www.imdb.com/title/${selectedMovie.imdb_id}`}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-2 text-primary hover:underline"
														>
															<img
																src={selectedMovie.poster}
																alt={`${selectedMovie.title} poster`}
																className={`rounded-lg shadow-lg max-h-[400px] object-cover transition-all ${isSpinning ? "blur-sm" : ""}`}
															/>
														</a>
													</div>
												)}
												<h2 className="text-3xl md:text-5xl font-bold text-balance">
													{selectedMovie.title}
												</h2>
												<p className="text-xl md:text-2xl text-muted-foreground">
													{selectedMovie.year}
												</p>
												<div className="flex flex-wrap gap-2 justify-center">
													{selectedMovie.genres.map((genre) => (
														<Badge key={genre} variant="secondary" className="text-sm px-3 py-1">
															{genre}
														</Badge>
													))}
												</div>
											</div>
										) : (
											<div className="text-center space-y-4">
												<Film className="w-20 h-20 mx-auto text-muted-foreground/30" />
												<p className="text-xl text-muted-foreground">
													{selectedGenres.length > 0 && selectedYears.length > 0
														? "Ready to spin with your selected filters!"
														: "Select at least one genre and one year to start"}
												</p>
											</div>
										)}
									</div>

									{/* Spin Button */}
									<div className="flex justify-center">
										<ButtonGroup>
											<Button
												onClick={handleAddToQueue}
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
											>
												<Sparkles className={`size-5 ${isSpinning ? "animate-spin" : ""}`} />
												{isSpinning ? "Spinning..." : "Spin the Wheel"}
											</Button>
										</ButtonGroup>
									</div>
									<div className="flex justify-center">
										<Button variant="outline" onClick={handleRandom}>
											<PartyPopper className="size-5" />
											Random
										</Button>
									</div>
								</div>
							</Card>
						</div>
						{/* Info Section */}
						<div className="text-center text-sm text-muted-foreground">
							<p>
								{selectedGenres.length > 0 || selectedYears.length > 0
									? `Filtering by: ${[
											selectedGenres.length > 0 ? `Genres: ${selectedGenres.join(", ")}` : "",
											selectedYears.length > 0 ? `Years: ${selectedYears.join(", ")}` : "",
										]
											.filter(Boolean)
											.join(" | ")}`
									: "Select genres or years above to filter your movie selection"}
							</p>
						</div>
						<GenreFilters
							setErrors={setErrors}
							selectedGenres={selectedGenres}
							onGenresChange={setSelectedGenres}
						/>
						{errors.genre && <p className="text-red-500 text-sm mt-2">{errors.genre}</p>}

						{/* Year Filter */}
						<YearFilter
							setErrors={setErrors}
							availableYears={availableYears}
							selectedYears={selectedYears}
							onYearsChange={setSelectedYears}
						/>
						{errors.year && <p className="text-red-500 text-sm mt-2">{errors.year}</p>}
					</div>
				</div>
			</div>
		</>
	)
}
