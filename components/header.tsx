import { Film } from "lucide-react";

interface HeaderProps {
  queueButton?: React.ReactNode;
  queueCount?: number;
}

export default function Header({ queueButton }: HeaderProps) {
    return (
          <div className="sticky top-0 z-50 w-full flex justify-between items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">

              <div className="flex items-center justify-center gap-3">
              <Film className="w-10 h-10 text-accent" />
              <h1 className="text-4xl md:text-6xl font-bold text-balance">Movie Roulette</h1>
            </div>
            {queueButton && <div>{queueButton}</div>}
        </div>


    )
}