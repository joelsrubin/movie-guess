import { Flame, Frown, ThumbsDown, ThumbsUp } from "lucide-react"
import { useRatingParams } from "@/hooks/use-query-state-helpers"
import { Slider } from "../ui/slider"

export function PopularitySlider() {
	const [params, setParams] = useRatingParams()

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-foreground">Rating</h2>
				<span className="text-sm text-muted-foreground">{`${params.rating}%`}</span>
			</div>
			<div className="flex flex-row justify-between">
				<Frown />
				<Slider
					min={0}
					max={100}
					step={10}
					value={[params.rating]}
					onValueChange={(value) => {
						setParams({ rating: value[0] })
					}}
					className="w-[80%]"
				/>
				<Flame />
			</div>
		</div>
	)
}
