"use client";

import { Trash } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const allGenres = [
	"Action",
	"Adventure",
	"Animation",
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
];

interface GenreFiltersProps {
	selectedGenres: string[];
	onGenresChange: (genres: string[]) => void;
	setErrors: React.Dispatch<
		React.SetStateAction<{ genre: string; year: string }>
	>;
}

export function GenreFilters({
	selectedGenres,
	onGenresChange,
	setErrors,
}: GenreFiltersProps) {
	const toggleGenre = (genre: string) => {
		setErrors((prev) => ({ ...prev, genre: "" }));
		if (selectedGenres.includes(genre)) {
			onGenresChange(selectedGenres.filter((g) => g !== genre));
		} else {
			onGenresChange([...selectedGenres, genre]);
		}
	};

	const clearAll = () => {
		onGenresChange([]);
	};

	return (
		<div className="space-y-4">
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="genres">
					<AccordionTrigger>
						{" "}
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Filter by Genre</h3>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-wrap gap-2">
							{allGenres.map((genre) => {
								const isSelected = selectedGenres.includes(genre);
								return (
									<Badge
										key={genre}
										variant={isSelected ? "default" : "outline"}
										className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
											isSelected
												? "bg-primary text-primary-foreground hover:bg-primary/90"
												: "hover:bg-secondary"
										}`}
										onClick={() => toggleGenre(genre)}
									>
										{genre}
									</Badge>
								);
							})}
							{selectedGenres.length > 0 && (
								<Trash
									className="w-4 self-center h-4 mr-1 hover:cursor-pointer"
									onClick={clearAll}
								/>
							)}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
