import { parseAsInteger, useQueryStates } from "nuqs"

export const useYearParams = () => {
	return useQueryStates({
		year_start: parseAsInteger.withDefault(new Date().getFullYear()),
		year_end: parseAsInteger.withDefault(new Date().getFullYear()),
	})
}
