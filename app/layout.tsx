import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ThemedToaster } from "@/components/providers/themed-toaster"
import { queryClient } from "@/lib/query-client"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Movie Roulette",
	description: "Grab a flick!",
	icons: {
		icon: "https://fav.farm/🎬",
		apple: "/clapper.png",
	},

	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "Movie Roulette",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<NuqsAdapter>{children}</NuqsAdapter>
						<ThemedToaster />
					</ThemeProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	)
}
