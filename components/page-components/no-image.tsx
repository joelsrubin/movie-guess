"use client"
import { PlusCircle, TriangleAlert } from "lucide-react"
import { Empty, EmptyDescription, EmptyMedia } from "../ui/empty"

export function NoImage({ variant = "error" }: { variant?: "error" | "default" }) {
	const errorContent = (
		<>
			<EmptyMedia variant="icon">
				<TriangleAlert />
			</EmptyMedia>

			<EmptyDescription>Image not available</EmptyDescription>
		</>
	)

	const defaultContent = (
		<>
			<EmptyMedia variant="icon">
				<PlusCircle />
			</EmptyMedia>

			<EmptyDescription>Add a filter to get started</EmptyDescription>
		</>
	)
	return (
		<Empty className="min-h-[400px]">{variant === "error" ? errorContent : defaultContent}</Empty>
	)
}
