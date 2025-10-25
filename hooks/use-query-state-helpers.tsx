import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs"

export const useYearParams = () => {
	return useQueryStates({
		year_start: parseAsInteger.withDefault(new Date().getFullYear()),
		year_end: parseAsInteger.withDefault(new Date().getFullYear()),
	})
}

export const useGenreParams = () => {
	return useQueryStates({
		genres: parseAsArrayOf(parseAsString).withDefault([]),
	})
}

export const useRatingParams = () => {
	return useQueryStates({
		rating: parseAsInteger.withDefault(50),
	})
}
