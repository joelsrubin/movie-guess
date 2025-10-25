"use client"

import { Film, Share } from "lucide-react"
import { toast } from "sonner"
import type { WatchProviders } from "@/app/page"
import { useWindowSize } from "@/hooks/use-window-size"
import { FiltersModal } from "../modals/filters-modal"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { ModeToggle } from "./mode-toggle"

interface HeaderProps {
	queueButton?: React.ReactNode
	queueCount?: number
	providers?: WatchProviders
}

export default function Header({ queueButton, providers }: HeaderProps) {
	const shareOrCopyToClipboard = async () => {
		try {
			await navigator.share({
				title: "Movie Roulette",
				url: window.location.href,
			})
		} catch (_) {
			navigator.clipboard.writeText(window.location.href)
			toast.success("Copied to clipboard")
		}
	}

	const { breakpoint } = useWindowSize({ initializeWithValue: false })

	return (
		<div className="sticky top-0 z-50 py-2 max-w-screen flex justify-between items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-2">
			<div className="flex items-center justify-center gap-3">
				<Film className="w-10 h-10 text-primary" />
				{breakpoint.name !== "XS" && <p className="text-xl font-bold">Movie Roulette</p>}
			</div>
			<div className="flex items-center gap-3">
				{queueButton && <div>{queueButton}</div>}
				<FiltersModal />
				<ButtonGroup>
					<ModeToggle />
					<Button variant="outline" size="icon" onClick={shareOrCopyToClipboard}>
						<Share />
					</Button>
				</ButtonGroup>
			</div>
		</div>
	)
}
