import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import type { Movie } from "@/components/movie-roulette"
import { MovieRoulette } from "@/components/movie-roulette"
import { MockProviders } from "./mock-providers"

vi.mock("@/lib/api", () => ({
	fetchRandomMovie: vi.fn(() =>
		Promise.resolve({
			title: "Test Movie",
			year: 2024,
			genres: ["Action"],
			id: 123,
			poster: "/test.jpg",
			imdb_id: "tt123",
		}),
	),
}))

describe("MovieRoulette", () => {
	beforeEach(() => {
		localStorage.clear()
	})

	test("renders spin button", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} providers={[]} />
			</MockProviders>,
		)
		expect(screen.getByRole("button", { name: /spin/i })).toBeInTheDocument()
	})

	test("renders with default movie data", async () => {
		const movie: Movie = {
			title: "The Matrix",
			year: 1999,
			genres: ["Action", "Sci-Fi"],
			id: 603,
			poster: "/poster.jpg",
			imdb_id: "tt0133093",
			blurb: "Lorem ipsum dolor sit.",
		}

		render(
			<MockProviders>
				<MovieRoulette defaultData={movie} providers={[]} />
			</MockProviders>,
		)

		await waitFor(() => {
			expect(screen.getByText("The Matrix")).toBeInTheDocument()
		})
	})

	test("shows random button", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} providers={[]} />
			</MockProviders>,
		)

		expect(screen.getByRole("button", { name: /random/i })).toBeInTheDocument()
	})

	test("shows queue button", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} providers={[]} />
			</MockProviders>,
		)

		expect(screen.getAllByRole("button", { name: /queue/i })[0]).toBeInTheDocument()
	})

	test("can add movie to queue", async () => {
		const user = userEvent.setup()
		const movie: Movie = {
			title: "Test Movie",
			year: 2024,
			genres: ["Action"],
			id: 123,
			poster: "/test.jpg",
			imdb_id: "tt123",
			blurb: "Lorem ipsum dolor sit.",
		}

		render(
			<MockProviders>
				<MovieRoulette defaultData={movie} providers={[]} />
			</MockProviders>,
		)

		const addButton = screen.getByRole("button", { name: /add to queue/i })
		await user.click(addButton)

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /added to queue/i })).toBeInTheDocument()
		})
	})
})
