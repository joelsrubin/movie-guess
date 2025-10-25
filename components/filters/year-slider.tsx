import { useYearParams } from "@/hooks/use-query-state-helpers"
import { Slider } from "../ui/slider"

const MIN_YEAR = 1940
const MAX_YEAR = new Date().getFullYear()

export function YearSlider() {
	const [params, setParams] = useYearParams()

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-foreground">Year</h2>
				<span className="text-sm text-muted-foreground">
					{params.year_start === params.year_end
						? params.year_start
						: `${params.year_start}–${params.year_end}`}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<Slider
					min={MIN_YEAR}
					max={MAX_YEAR}
					step={1}
					value={[params.year_start || MIN_YEAR, params.year_end || MAX_YEAR]}
					onValueChange={(value) => {
						setParams({ year_start: value[0], year_end: value[1] })
					}}
					className="w-full"
				/>
			</div>
		</div>
	)
}
