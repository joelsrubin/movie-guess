import { TriangleAlert } from "lucide-react"
import { Empty, EmptyDescription, EmptyMedia } from "./ui/empty"

export function NoImage() {
	return (
		<Empty className="min-h-[400px]">
			<EmptyMedia variant="icon">
				<TriangleAlert />
			</EmptyMedia>

			<EmptyDescription>Image not available</EmptyDescription>
		</Empty>
	)
}
