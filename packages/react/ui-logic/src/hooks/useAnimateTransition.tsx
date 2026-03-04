import { useEffect, useRef } from 'react'

type Props = {
	dependencyList: readonly unknown[]
}

export function useAnimateTransition({ dependencyList }: Props) {
	const bodyRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const prevHeightRef = useRef<number>(0)
	const isAnimating = useRef<boolean>(false)

	useEffect(() => {
		const bodyElement = bodyRef.current
		const wrapperElement = wrapperRef.current

		if (!bodyElement || !wrapperElement) return
		wrapperElement.style.overflow = 'hidden'
		const headerElement = wrapperElement.querySelector('header')
		const headerHeight = headerElement?.clientHeight!
		const bodyHeight = bodyElement.clientHeight

		const computedWrapper = window.getComputedStyle(wrapperElement)
		const paddingTop = Number.parseFloat(computedWrapper.paddingTop)
		const paddingBottom = Number.parseFloat(computedWrapper.paddingBottom)
		const borderTop = Number.parseFloat(computedWrapper.borderTopWidth)
		const borderBottom = Number.parseFloat(computedWrapper.borderBottomWidth)
		const extraHeight = paddingTop + paddingBottom + borderTop + borderBottom
		const minHeight = Number.parseFloat(computedWrapper.minHeight) || 0

		// first render
		if (!prevHeightRef.current) {
			const calculatedHeight = bodyHeight + headerHeight + extraHeight
			prevHeightRef.current = Math.max(calculatedHeight, minHeight)
		}

		isAnimating.current = false
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const bodyHeight = entry.borderBoxSize[0].blockSize
				const calculatedHeight = bodyHeight + headerHeight + extraHeight
				const newHeight = Math.max(calculatedHeight, minHeight)
				const prevHeight = prevHeightRef.current

				if (Math.abs(prevHeight - newHeight) > 1 && !isAnimating.current) {
					isAnimating.current = true
					wrapperElement.style.transition = 'none'
					wrapperElement.style.height = `${prevHeight}px`

					requestAnimationFrame(() => {
						wrapperElement.style.transition = 'height 0.2s ease-out'
						wrapperElement.style.height = `${newHeight}px`

						setTimeout(() => {
							wrapperElement.style.height = 'auto'
						}, 301)
					})
					prevHeightRef.current = newHeight
				}
			}
		})
		observer.observe(bodyElement)

		return () => {
			observer.disconnect()
			isAnimating.current = false
			wrapperElement.style.transition = 'none'
			wrapperElement.style.height = 'auto'
		}
	}, dependencyList)

	return {
		bodyRef,
		wrapperRef,
	}
}
