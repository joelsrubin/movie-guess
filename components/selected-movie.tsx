import Image from "next/image"
import type { Movie } from "./movie-roulette"
import { NoImage } from "./no-image"
import { Badge } from "./ui/badge"

export function SelectedMovie({
	selectedMovie,
	setIsSpinning,
	isSpinning,
}: {
	selectedMovie: Movie | null
	setIsSpinning: (value: boolean) => void
	isSpinning: boolean
}) {
	console.log({ selectedMovie })
	return selectedMovie ? (
		<div className="text-center space-y-4 animate-in fade-in duration-300">
			{selectedMovie.poster ? (
				<div className="flex justify-center pb-8 relative min-h-[400px]">
					<a
						href={`https://www.imdb.com/title/${selectedMovie.imdb_id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-primary hover:underline"
					>
						<Image
							key={selectedMovie.id}
							onError={() => setIsSpinning(false)}
							onLoad={() => setIsSpinning(false)}
							src={selectedMovie.poster}
							alt={`${selectedMovie.title} poster`}
							width={500}
							height={750}
							className={`w-auto object-contain transition-all duration-500 ${isSpinning ? "blur-sm" : ""}`}
							priority
						/>
					</a>
				</div>
			) : (
				<NoImage />
			)}
			<h2 className="text-3xl md:text-5xl font-bold text-balance">{selectedMovie.title}</h2>
			<p className="text-xl md:text-2xl text-muted-foreground">{selectedMovie.year}</p>
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
	)
}
