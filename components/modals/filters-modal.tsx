"use client"

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
import { ProvidersToggleGroup } from "../filters/providers-toggle-group"
import { YearSlider } from "../filters/year-slider"
import { Separator } from "../ui/separator"

export function FiltersModal({ trigger }: { trigger: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				aria-describedby="queue-modal"
				className="max-w-3xl max-h-[80vh] flex flex-col"
			>
				<DialogHeader className="sticky">
					<DialogTitle>Filters</DialogTitle>
					<Separator />
				</DialogHeader>
				<div className="flex flex-col space-y-6 overflow-scroll">
					<GenreFilters />
					<Separator />
					<ProvidersToggleGroup />
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
