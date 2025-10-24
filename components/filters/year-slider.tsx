import { useYearParams } from "@/hooks/use-year-params"
import { Slider } from "../ui/slider"

export function YearSlider() {
	const [params, setParams] = useYearParams()

	return (
		<div className="space-y-4 pb-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-foreground">Filter by Year</h2>
				<span className="text-sm text-muted-foreground">
					{params.year_start === params.year_end
						? params.year_start
						: `${params.year_start}–${params.year_end}`}
				</span>
			</div>
			<Slider
				min={1940}
				max={new Date().getFullYear()}
				step={1}
				value={[params.year_start || 1940, params.year_end || new Date().getFullYear()]}
				onValueChange={(value) => {
					setParams({ year_start: value[0], year_end: value[1] })
				}}
				className="w-full"
			/>
		</div>
	)
}
