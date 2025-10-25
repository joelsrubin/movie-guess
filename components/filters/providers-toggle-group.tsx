import Image from "next/image"
import type { WatchProviders } from "@/app/page"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useProvidersParams } from "@/hooks/use-query-state-helpers"
import { TMDB_IMAGE_BASE } from "@/lib/constants"

export function ProvidersToggleGroup({ providers }: { providers?: WatchProviders }) {
	const [params, setParams] = useProvidersParams()

	return (
		<>
			<h2 className="text-sm font-semibold text-foreground mb-0">Providers</h2>
			<div className="overflow-x-scroll">
				<ToggleGroup
					type="multiple"
					variant="outline"
					spacing={2}
					size="lg"
					className="py-4"
					onValueChange={(value) => setParams({ providers: value })}
					defaultValue={params.providers}
				>
					{providers?.map((p) => {
						return (
							<ToggleGroupItem
								key={p.id}
								value={p.id}
								className="grayscale data-[state=on]:grayscale-0 size-20"
							>
								<Image
									className="rounded-sm"
									src={`${TMDB_IMAGE_BASE}/${p.logo}`}
									alt="logo"
									width={40}
									height={40}
									priority
								/>
							</ToggleGroupItem>
						)
					})}
				</ToggleGroup>
			</div>
		</>
	)
}
