import type { FetchMovieParams } from "./api"

export const movieKeys = {
	all: ["movies"] as const,
	selected: () => [...movieKeys.all, "selected"] as const,
	detail: (id: number) => [...movieKeys.all, "detail", id] as const,
	random: (params: FetchMovieParams) => [...movieKeys.all, "random", params] as const,
	providers: () => [...movieKeys.all, "providers"] as const,
}
