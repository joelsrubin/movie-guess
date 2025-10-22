import { Film } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

interface HeaderProps {
	queueButton?: React.ReactNode
	queueCount?: number
}

export default function Header({ queueButton }: HeaderProps) {
	return (
		<div className="sticky top-0 z-50 max-w-screen flex justify-between items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-2">
			<div className="flex items-center justify-center gap-3">
				<Film className="w-10 h-10 text-primary" />
				<h1 className="sm:text-4xl text-sm md:text-6xl font-bold text-balance">Movie Roulette</h1>
			</div>
			<div className="flex items-center gap-3">
				{queueButton && <div>{queueButton}</div>}
				<ModeToggle />
			</div>
		</div>
	)
}
