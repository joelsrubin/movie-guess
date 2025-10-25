import { parseAsArrayOf, parseAsInteger, parseAsString, throttle, useQueryStates } from "nuqs"

export const useYearParams = () => {
	return useQueryStates(
		{
			year_start: parseAsInteger.withDefault(new Date().getFullYear()),
			year_end: parseAsInteger.withDefault(new Date().getFullYear()),
		},
		{ shallow: false, limitUrlUpdates: throttle(1000) },
	)
}

export const useGenreParams = () => {
	return useQueryStates(
		{
			genres: parseAsArrayOf(parseAsString).withDefault([]),
		},
		{ shallow: false, limitUrlUpdates: throttle(1000) },
	)
}

export const useProvidersParams = () => {
	return useQueryStates(
		{
			providers: parseAsArrayOf(parseAsString).withDefault([]),
		},
		{ shallow: false, limitUrlUpdates: throttle(1000) },
	)
}
