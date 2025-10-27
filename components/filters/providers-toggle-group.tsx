import Image from "next/image"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useProvidersParams } from "@/hooks/use-query-state-helpers"
import { TMDB_IMAGE_BASE } from "@/lib/constants"

export const providers = [
	{
		logo: "/vEtdiYRPRbDCp1Tcn3BEPF1Ni76.jpg",
		name: "Shudder",
		id: "99",
	},
	{
		logo: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg",
		name: "Netflix",
		id: "8",
	},
	{
		logo: "/97yvRBw1GzX7fXprcF80er19ot.jpg",
		name: "Disney Plus",
		id: "337",
	},
	{
		logo: "/pvske1MyAoymrs5bguRfVqYiM9a.jpg",
		name: "Amazon Prime Video",
		id: "9",
	},

	{
		logo: "/seGSXajazLMCKGB5hnRCidtjay1.jpg",
		name: "Amazon Video",
		id: "10",
	},
	{
		logo: "/oMYZg3cGAGp9ecKGlBgumcjDmnN.jpg",
		name: "Apple TV",
		id: "2",
	},
	{
		logo: "/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg",
		name: "Hulu",
		id: "15",
	},

	{
		logo: "/9BgaNQRMDvVlji1JBZi6tcfxpKx.jpg",
		name: "fuboTV",
		id: "257",
	},
	{
		logo: "/yhrtzYd43pFIhRq0ruO8umJPuyn.jpg",
		name: "Criterion Channel",
		id: "258",
	},
]
export function ProvidersToggleGroup() {
	const [params, setParams] = useProvidersParams()
	return (
		<>
			<h2 className="text-sm font-semibold text-foreground mb-0">Providers</h2>
			<div className="overflow-x-scroll px-4 min-h-30">
				<ToggleGroup
					type="multiple"
					variant="outline"
					spacing={2}
					size="lg"
					className="py-4"
					onValueChange={(value) => setParams({ providers: value })}
					defaultValue={params.providers}
				>
					{providers.map((p) => {
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
