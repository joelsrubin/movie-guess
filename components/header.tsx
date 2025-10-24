import { Film, Share } from "lucide-react"
import { toast } from "sonner"
import { useWindowSize } from "@/hooks/use-window-size"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"

interface HeaderProps {
	queueButton?: React.ReactNode
	queueCount?: number
}

export default function Header({ queueButton }: HeaderProps) {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href)
		toast.success("Copied to clipboard")
	}

	const { width = 0, height = 0 } = useWindowSize()
	const getBreakpoint = () => {
		if (width < 640) return { name: "XS", color: "destructive" as const }
		if (width < 768) return { name: "SM", color: "default" as const }
		if (width < 1024) return { name: "MD", color: "secondary" as const }
		if (width < 1280) return { name: "LG", color: "outline" as const }
		if (width < 1536) return { name: "XL", color: "default" as const }
		return { name: "2XL", color: "secondary" as const }
	}

	const breakpoint = getBreakpoint()
	const _aspectRatio = width > 0 ? (width / height).toFixed(2) : "0.00"
	console.log(breakpoint.name)
	return (
		<div className="sticky top-0 z-50 py-2 max-w-screen flex justify-between items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-2">
			<div className="flex items-center justify-center gap-3">
				<Film className="w-10 h-10 text-primary" />
				{breakpoint.name !== "XS" && <p className="text-xl font-bold">Movie Roulette</p>}
			</div>
			<div className="flex items-center gap-3">
				{queueButton && <div>{queueButton}</div>}
				<ButtonGroup>
					<ModeToggle />
					<Button variant="outline" size="icon" onClick={copyToClipboard}>
						<Share />
					</Button>
				</ButtonGroup>
			</div>
		</div>
	)
}
