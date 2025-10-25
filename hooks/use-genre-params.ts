import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

export const useGenreParams = () => {
	return useQueryStates({
		genres: parseAsArrayOf(parseAsString).withDefault([]),
	})
}
