"use client"

import * as React from "react"
import { useState } from "react"
import { useDebounceCallback } from "./use-debounce-callback"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

type WindowSize<T extends number | undefined = number | undefined> = {
	width: T
	height: T
}

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
	initializeWithValue: InitializeWithValue
	debounceDelay?: number
}

const IS_SERVER = typeof window === "undefined"

// Compact event listener hook for resize events
function useEventListener(eventName: string, handler: () => void) {
	const savedHandler = React.useRef(handler)

	React.useEffect(() => {
		savedHandler.current = handler
	}, [handler])

	React.useEffect(() => {
		if (IS_SERVER) return
		const eventListener = () => savedHandler.current()
		window.addEventListener(eventName, eventListener)
		return () => window.removeEventListener(eventName, eventListener)
	}, [eventName])
}
type EWindowSize = "XS" | "SM" | "MD" | "LG" | "XL" | "2XL"
// SSR version of useWindowSize.
export function useWindowSize(
	options: UseWindowSizeOptions<false>,
): WindowSize<number> & { breakpoint: { name: EWindowSize } }
// CSR version of useWindowSize.
export function useWindowSize(
	options?: Partial<UseWindowSizeOptions<true>>,
): WindowSize<number> & { breakpoint: { name: EWindowSize } }
export function useWindowSize(
	options: Partial<UseWindowSizeOptions<boolean>> = {},
): WindowSize | (WindowSize<number> & { breakpoint: { name: EWindowSize } }) {
	let { initializeWithValue = true } = options
	if (IS_SERVER) {
		initializeWithValue = false
	}

	const [windowSize, setWindowSize] = useState<WindowSize>(() => {
		if (initializeWithValue) {
			return {
				width: window.innerWidth,
				height: window.innerHeight,
			}
		}
		return {
			width: undefined,
			height: undefined,
		}
	})

	const debouncedSetWindowSize = useDebounceCallback(setWindowSize, options.debounceDelay)

	function handleSize() {
		const setSize = options.debounceDelay ? debouncedSetWindowSize : setWindowSize

		setSize({
			width: window.innerWidth,
			height: window.innerHeight,
		})
	}

	useEventListener("resize", handleSize)

	// Set size at the first client-side load
	useIsomorphicLayoutEffect(() => {
		handleSize()
	}, [])

	const getBreakpoint = (): { name: EWindowSize } => {
		if (!windowSize.width) return { name: "2XL" }
		if (windowSize.width < 640) return { name: "XS" }
		if (windowSize.width < 768) return { name: "SM" }
		if (windowSize.width < 1024) return { name: "MD" }
		if (windowSize.width < 1280) return { name: "LG" }
		if (windowSize.width < 1536) return { name: "XL" }
		return { name: "2XL" }
	}

	return { ...windowSize, breakpoint: getBreakpoint() }
}
