"use client"

import { genreMap } from "@/lib/constants"

import { Button } from "../ui/button"

export const allGenres = [
	"Action",
	"Adventure",
	"Comedy",
	"Crime",
	"Drama",
	"Fantasy",
	"Horror",
	"Music",
	"Mystery",
	"Romance",
	"Sci-Fi",
	"Thriller",
]

interface GenreFiltersProps {
	selectedGenres: string[]
	onGenresChange: (genres: string[]) => void
}

export function GenreFilters({ selectedGenres, onGenresChange }: GenreFiltersProps) {
	const toggleGenre = (genre: string) => {
		if (selectedGenres.includes(genre)) {
			onGenresChange(selectedGenres.filter((g) => g !== genre))
		} else {
			onGenresChange([...selectedGenres, genre])
		}
	}

	return (
		<div className="space-y-3">
			<h2 className="text-sm font-semibold text-foreground">Filter by Genre</h2>
			<div className="flex gap-2 flex-wrap">
				{Object.keys(genreMap).map((genre) => (
					<Button
						key={genre}
						variant={selectedGenres.includes(genre) ? "default" : "outline"}
						size="sm"
						onClick={() => toggleGenre(genre)}
						className="rounded-full"
					>
						{genre}
					</Button>
				))}
			</div>
		</div>
	)
}
