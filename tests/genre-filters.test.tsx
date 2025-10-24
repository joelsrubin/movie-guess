import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { GenreFilters } from "@/components/filters/genre-filters"

describe("GenreFilters", () => {
	test("renders all genre buttons", () => {
		const onGenresChange = vi.fn()
		render(<GenreFilters selectedGenres={[]} onGenresChange={onGenresChange} />)

		expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Comedy" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Drama" })).toBeInTheDocument()
	})

	test("shows selected genres with default variant", () => {
		const onGenresChange = vi.fn()
		render(<GenreFilters selectedGenres={["Action"]} onGenresChange={onGenresChange} />)

		const actionButton = screen.getByRole("button", { name: "Action" })
		expect(actionButton).toHaveClass("bg-primary")
	})

	test("calls onGenresChange when genre is toggled", async () => {
		const user = userEvent.setup()
		const onGenresChange = vi.fn()
		render(<GenreFilters selectedGenres={[]} onGenresChange={onGenresChange} />)

		const actionButton = screen.getByRole("button", { name: "Action" })
		await user.click(actionButton)

		expect(onGenresChange).toHaveBeenCalledWith(["Action"])
	})

	test("removes genre when already selected", async () => {
		const user = userEvent.setup()
		const onGenresChange = vi.fn()
		render(<GenreFilters selectedGenres={["Action", "Comedy"]} onGenresChange={onGenresChange} />)

		const actionButton = screen.getByRole("button", { name: "Action" })
		await user.click(actionButton)

		expect(onGenresChange).toHaveBeenCalledWith(["Comedy"])
	})
})
