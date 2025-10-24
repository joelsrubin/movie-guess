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
				<MovieRoulette defaultData={null} />
			</MockProviders>,
		)
		expect(screen.getByRole("button", { name: /spin/i })).toBeInTheDocument()
	})

	test("renders with default movie data", () => {
		const movie: Movie = {
			title: "The Matrix",
			year: 1999,
			genres: ["Action", "Sci-Fi"],
			id: 603,
			poster: "/poster.jpg",
			imdb_id: "tt0133093",
		}

		render(
			<MockProviders>
				<MovieRoulette defaultData={movie} />
			</MockProviders>,
		)

		expect(screen.getByText("The Matrix")).toBeInTheDocument()
	})

	test("displays genre filters", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} />
			</MockProviders>,
		)

		expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Comedy" })).toBeInTheDocument()
	})

	test("shows random button", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} />
			</MockProviders>,
		)

		expect(screen.getByRole("button", { name: /random/i })).toBeInTheDocument()
	})

	test("shows queue button", () => {
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} />
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
		}

		render(
			<MockProviders>
				<MovieRoulette defaultData={movie} />
			</MockProviders>,
		)

		const addButton = screen.getByRole("button", { name: /add to queue/i })
		await user.click(addButton)

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /added to queue/i })).toBeInTheDocument()
		})
	})

	test("toggles genre filter", async () => {
		const user = userEvent.setup()
		render(
			<MockProviders>
				<MovieRoulette defaultData={null} />
			</MockProviders>,
		)

		const actionButton = screen.getByRole("button", { name: "Action" })
		await user.click(actionButton)

		expect(screen.getByText("Active filters:")).toBeInTheDocument()
	})
})
