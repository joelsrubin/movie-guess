"use client"

import { useQuery } from "@tanstack/react-query"
import { ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { movieKeys } from "@/lib/query-keys"
import type { Movie } from "../movie-roulette"
import { Button } from "../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { NoImage } from "./no-image"

export function SelectedMovie({
	defaultData,
	isSpinning,
}: {
	defaultData: Movie | null
	isSpinning: boolean
}) {
	const { data: selectedMovie } = useQuery({
		queryKey: movieKeys.selected(),
		queryFn: () => defaultData,
		initialData: defaultData,
	})

	const [isOpen, setIsOpen] = useState(false)

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (isSpinning) {
			setIsLoading(true)
		}
	}, [isSpinning])

	return selectedMovie ? (
		<div className="text-center space-y-4 animate-in fade-in duration-300">
			{selectedMovie.poster ? (
				<div className="flex justify-center pb-2 relative ">
					<a
						href={`https://www.imdb.com/title/${selectedMovie.imdb_id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-primary hover:underline"
					>
						<Image
							src={selectedMovie.poster}
							alt={`${selectedMovie.title} poster`}
							width={500}
							height={750}
							onLoad={() => setIsLoading(false)}
							className={`w-auto object-contain transition-all duration-500 ${isSpinning || isLoading ? "blur-sm" : ""}`}
							priority
						/>
					</a>
				</div>
			) : (
				<NoImage />
			)}
			<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
				<div className="flex flex-col items-center gap-2">
					<div className="flex flex-row gap-2">
						<h2 className="text-3xl md:text-5xl font-bold text-balance">{selectedMovie.title}</h2>
						{selectedMovie.blurb && (
							<CollapsibleTrigger asChild>
								<Button variant="ghost" size="icon" className="gap-2">
									<ChevronsUpDown className="h-4 w-4" />
								</Button>
							</CollapsibleTrigger>
						)}
					</div>
					<p className="text-xl md:text-2xl text-muted-foreground">{selectedMovie.year}</p>
				</div>
				<CollapsibleContent className="max-w-2xl mx-auto px-4 pb-4">
					<p className="text-muted-foreground text-sm text-balance">{selectedMovie.blurb}</p>
				</CollapsibleContent>
			</Collapsible>
		</div>
	) : (
		<NoImage variant="default" />
	)
}
