"use client"

import { useGenreParams } from "@/hooks/use-genre-params"
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

export function GenreFilters() {
	const [params, setParams] = useGenreParams()
	const selectedGenres = params.genres
	const toggleGenre = (genre: string) => {
		if (params.genres.includes(genre)) {
			setParams({ genres: params.genres.filter((g) => g !== genre) })
		} else {
			setParams({ genres: [...params.genres, genre] })
		}
	}

	return (
		<div className="space-y-3">
			<h2 className="text-sm font-semibold text-foreground">Genre</h2>
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
