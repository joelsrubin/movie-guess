"use client"

import { useMutation } from "@tanstack/react-query"
import { Check, ListVideo, PartyPopper, Plus, Sparkles, X } from "lucide-react"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useEffect, useState } from "react"
import { allGenres, GenreFilters } from "@/components/genre-filters"
import { QueueModal } from "@/components/queue-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fetchRandomMovie } from "@/lib/api"
import { QUEUE_STORAGE_KEY } from "@/lib/constants"
import { movieKeys } from "@/lib/query-keys"
import Header from "./header"
import { SelectedMovie } from "./selected-movie"
import { ButtonGroup } from "./ui/button-group"

import { YearSlider } from "./year-slider"

export interface Movie {
	title: string
	year: number
	genres: string[]
	id: number
	poster: string
	imdb_id: string
}

export function MovieRoulette({ defaultData }: { defaultData: Movie | null }) {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(defaultData)
	const [params, setParams] = useQueryStates({
		genres: parseAsArrayOf(parseAsString).withDefault([]),
		year_start: parseAsInteger.withDefault(new Date().getFullYear()),
		year_end: parseAsInteger.withDefault(new Date().getFullYear()),
		movieId: parseAsInteger,
	})

	const [queue, setQueue] = useState<Movie[]>([])

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

	const { mutate: fetchMovie, isPending: isSpinning } = useMutation({
		mutationFn: fetchRandomMovie,
		mutationKey: movieKeys.random({
			genres: params.genres,
			yearStart: params.year_start,
			yearEnd: params.year_end,
		}),
		onSuccess: (movie) => {
			setSelectedMovie(movie)
			setParams({ movieId: movie.id })
		},
	})

	const handleSpin = (overrides: { genre?: string; year?: number } = {}) => {
		fetchMovie({
			genres: params.genres,
			yearStart: params.year_start,
			yearEnd: params.year_end,
			genre: overrides.genre,
			year: overrides.year,
		})
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
								{queue.length > 0 && (
									<Badge className="ml-2 px-2 py-0.5 text-xs">{queue.length}</Badge>
								)}
							</Button>
						}
					/>
				}
			/>
			<div className="container flex justify-center items-center mx-auto">
				<div className="mx-auto px-4 py-2">
					<div className="max-w-4xl mx-auto ">
						<div className="flex justify-center items-center pt-4">
							<Card className="w-full max-w-sm md:max-w-lg">
								<div className="space-y-8">
									<div className="min-h-[200px] flex items-center justify-center">
										<SelectedMovie selectedMovie={selectedMovie} isSpinning={isSpinning} />
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
												onClick={() => fetchMovie({})}
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
