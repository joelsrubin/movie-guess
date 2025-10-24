import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { MovieRoulette } from "@/components/movie-roulette"
import { MockProviders } from "./mock-providers"

describe("Movie Roulette", () => {
	test("should render the page", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} />
			</MockProviders>,
		)
		expect(screen.getByRole("button", { name: /spin/i })).toBeInTheDocument()
	})
})
