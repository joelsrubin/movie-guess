"use client"

import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

interface Movie {
	title: string
	year: number
	genres: string[]
	id: number
	poster: string
}

interface QueueModalProps {
	movies: Movie[]
	trigger: React.ReactNode
	onRemove: (movieId: number) => void
	isLoading?: boolean
}

export function QueueModal({ movies, trigger, onRemove, isLoading = false }: QueueModalProps) {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const totalPages = Math.ceil(movies.length / itemsPerPage)

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentMovies = movies.slice(startIndex, endIndex)

	const handlePrevPage = () => {
		setCurrentPage((prev) => Math.max(1, prev - 1))
	}

	const handleNextPage = () => {
		setCurrentPage((prev) => Math.min(totalPages, prev + 1))
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				aria-describedby="queue-modal"
				className="max-w-3xl max-h-[80vh] flex flex-col"
			>
				<DialogHeader>
					<DialogTitle>Movie Queue ({movies.length})</DialogTitle>
				</DialogHeader>
				<div className="flex-1 overflow-y-auto">
					<div className="grid gap-4">
						{isLoading ? (
							<p className="text-muted-foreground text-center py-8">Loading queue...</p>
						) : movies.length === 0 ? (
							<p className="text-muted-foreground text-center py-8">No movies in queue</p>
						) : (
							currentMovies.map((movie) => (
								<Card key={movie.id}>
									<CardHeader>
										<div className="flex gap-4">
											{movie.poster && (
												<Image
													width={500}
													height={750}
													src={movie.poster}
													alt={`${movie.title} poster`}
													className="w-24 h-36 object-cover rounded-md"
												/>
											)}
											<div className="flex-1">
												<CardTitle>{movie.title}</CardTitle>
												<CardDescription>{movie.year}</CardDescription>
												<CardContent className="px-0 pt-2">
													<div className="flex flex-wrap gap-2">
														{movie.genres.map((genre) => (
															<Badge key={genre} variant="secondary">
																{genre}
															</Badge>
														))}
													</div>
												</CardContent>
											</div>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onRemove(movie.id)}
												className="self-start"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</CardHeader>
								</Card>
							))
						)}
					</div>
				</div>
				{totalPages > 1 && (
					<div className="flex items-center justify-between pt-4 border-t">
						<Button
							variant="outline"
							size="sm"
							onClick={handlePrevPage}
							disabled={currentPage === 1}
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page {currentPage} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={handleNextPage}
							disabled={currentPage === totalPages}
						>
							Next
							<ChevronRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
