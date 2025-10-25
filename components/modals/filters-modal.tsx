"use client"

import { FilterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { GenreFilters } from "../filters/genre-filters"
import { PopularitySlider } from "../filters/popularity-slider"
import { YearSlider } from "../filters/year-slider"
import { Separator } from "../ui/separator"

export function FiltersModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<FilterIcon className="size-4" />
					Filters
				</Button>
			</DialogTrigger>
			<DialogContent
				aria-describedby="queue-modal"
				className="max-w-3xl max-h-[80vh] flex flex-col"
			>
				<DialogHeader className="sticky">
					<DialogTitle>Filters</DialogTitle>
				</DialogHeader>
				<Separator />
				<div className="flex flex-col space-y-10 overflow-scroll">
					<GenreFilters />
					<Separator />
					<PopularitySlider />
					<Separator />
					<YearSlider />
					<Separator />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Save</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
