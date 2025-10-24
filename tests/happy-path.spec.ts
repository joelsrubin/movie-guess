import { expect, test } from "@playwright/test"

test.describe("Movie Roulette Happy Path", () => {
	test("should filter movies by genre", async ({ page }) => {
		await page.goto("/")

		const genreButton = page
			.getByRole("button")
			.filter({ hasText: /action|comedy|drama/i })
			.first()
		if (await genreButton.isVisible()) {
			await genreButton.click()

			await page.getByRole("button", { name: /spin/i }).click()

			await expect(page.locator("h2, h3").first()).toBeVisible({
				timeout: 15000,
			})
		}
	})

	test("should adjust year range and spin", async ({ page }) => {
		await page.goto("/")

		const slider = page.locator('input[type="range"]').first()
		if (await slider.isVisible()) {
			await slider.fill("2010")
		}

		await page.getByRole("button", { name: /spin/i }).click()

		await expect(page.locator("h2, h3").first()).toBeVisible({
			timeout: 15000,
		})
	})

	test("should apply filters from URL query parameters", async ({ page }) => {
		// Navigate with query parameters for genre and year range
		const testGenre = "action"
		const minYear = 2010
		const maxYear = 2020

		await page.goto(`/?genres=${testGenre}&year_start=${minYear}&year_end=${maxYear}`)

		// Wait for the page to load and apply filters
		await page.waitForLoadState("networkidle")

		// Verify the selected genre is active
		const selectedGenre = page.getByRole("button", {
			name: new RegExp(testGenre, "i"),
		})
		await expect(selectedGenre).toBeVisible()

		// Verify the year range is set correctly
		const yearDisplay = page.getByText(new RegExp(`${minYear}.*${maxYear}`, "i")).first()
		await expect(yearDisplay).toBeVisible()

		// Test that spinning with these filters works
		await page.getByRole("button", { name: /spin/i }).click()

		// Wait for the movie to load
		await expect(page.locator("h2, h3").first()).toBeVisible({
			timeout: 15000,
		})

		// Verify the URL still contains our filters after spinning
		await expect(page).toHaveURL(new RegExp(`genres=${testGenre}.*year_start=${minYear}`))
	})
})
