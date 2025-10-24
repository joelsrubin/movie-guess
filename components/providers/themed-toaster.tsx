"use client"
import { useTheme } from "next-themes"
import { Toaster } from "../ui/sonner"

export function ThemedToaster() {
	const { theme } = useTheme()
	return <Toaster position="top-left" theme={theme as "dark" | "light" | "system"} />
}
