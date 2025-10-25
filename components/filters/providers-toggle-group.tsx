import { BookmarkIcon, HeartIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import type { WatchProviders } from "@/app/page"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TMDB_IMAGE_BASE } from "@/lib/constants"

export function ProvidersToggleGroup({ providersList }: { providersList: WatchProviders }) {
	console.log({ providersList })
	return (
		<ToggleGroup type="multiple" variant="outline" spacing={2} size="sm">
			<ToggleGroupItem value={providersList[0].name}>
				<Image
					src={`${TMDB_IMAGE_BASE}/${providersList[0].logo}`}
					priority
					alt="logo"
					width={40}
					height={40}
				/>
			</ToggleGroupItem>
			<ToggleGroupItem
				value="star"
				aria-label="Toggle star"
				className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
			>
				<StarIcon />
				Star
			</ToggleGroupItem>
			<ToggleGroupItem
				value="heart"
				aria-label="Toggle heart"
				className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
			>
				<HeartIcon />
				Heart
			</ToggleGroupItem>
			<ToggleGroupItem
				value="bookmark"
				aria-label="Toggle bookmark"
				className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
			>
				<BookmarkIcon />
				Bookmark
			</ToggleGroupItem>
		</ToggleGroup>
	)
}
