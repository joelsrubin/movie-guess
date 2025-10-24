import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
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
		icon: "/clapper.png",
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
						<Toaster position="top-left" />
					</ThemeProvider>
					<ReactQueryDevtools initialIsOpen={false} />
					<SpeedInsights />
				</QueryClientProvider>
			</body>
		</html>
	)
}
