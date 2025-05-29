"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva("flex w-full rounded-md bg-transparent text-foreground transition-colors relative", {
    variants: {
        variant: {
            default: cn("text-black text-sm border border-neutral-200", "dark:text-white dark:bg-neutral-900"),
            ghost: "border-none bg-transparent shadow-none",
            outline: cn("border-input ring-offset-background", "dark:border-neutral-800"),
        },
        inputSize: {
            default: "h-10 px-4",
            sm: "h-8 text-sm px-3",
            lg: "h-12 text-lg px-4",
        },
        state: {
            default: cn(
                "hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "dark:hover:border-primary/50 dark:focus-within:ring-primary dark:focus-within:ring-offset-2",
            ),
            error: "border-destructive hover:border-destructive focus-within:ring-destructive",
            success: "border-green-500 hover:border-green-600 focus-within:ring-green-500",
            disabled: "opacity-50 cursor-not-allowed",
        },
    },
    defaultVariants: {
        variant: "default",
        inputSize: "default",
        state: "default",
    },
})

export interface CustomInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">,
    VariantProps<typeof inputVariants> {
    placeholder?: string
    onChange?: (value: string) => void
    maxLength?: number
    disabled?: boolean
    value?: string | undefined
    defaultValue?: string
    error?: boolean
    success?: boolean
    name?: string
    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void
    type?: string
    id?: string
    required?: boolean
    onEnter?: () => void
    icon?: React.ReactNode
    iconPosition?: "left" | "right"
}

// Helper hook to merge refs
function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
    return React.useCallback(
        (value: T) => {
            refs.forEach((ref) => {
                if (typeof ref === "function") {
                    ref(value)
                } else if (ref && "current" in ref) {
                    ; (ref as React.MutableRefObject<T>).current = value
                }
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        refs,
    )
}

const CustomInput = React.forwardRef<HTMLDivElement, CustomInputProps>(
    (
        {
            className,
            variant,
            inputSize,
            state,
            placeholder = "",
            onChange,
            maxLength,
            disabled = false,
            value,
            defaultValue = "",
            error = false,
            success = false,
            name,
            onBlur,
            onFocus,
            onEnter,
            icon,
            iconPosition = "left",
            ...props
        },
        ref,
    ) => {
        const inputRef = React.useRef<HTMLDivElement>(null)
        const mergedRef = useMergedRef(ref, inputRef)

        const [localValue, setLocalValue] = React.useState(defaultValue)
        const [, setIsFocused] = React.useState(false)
        const isControlled = value !== undefined

        // Determine state based on props
        const computedState = React.useMemo(() => {
            if (disabled) return "disabled"
            if (error) return "error"
            if (success) return "success"
            return state
        }, [disabled, error, success, state])

        React.useEffect(() => {
            if (isControlled && inputRef.current) {
                const currentText = inputRef.current.textContent || ""
                if (value !== currentText) {
                    let startOffset = 0
                    const selection = window.getSelection()

                    // Only try to get range if selection exists and has ranges
                    if (selection && selection.rangeCount > 0) {
                        try {
                            const range = selection.getRangeAt(0)
                            startOffset = range?.startOffset || 0
                        } catch (e) {
                            console.error("Error accessing selection range:", e)
                            // Continue with default startOffset = 0
                        }
                    }

                    inputRef.current.textContent = value
                    setLocalValue(value)

                    if (document.activeElement === inputRef.current && selection) {
                        setTimeout(() => {
                            try {
                                const newRange = document.createRange()
                                // Use optional chaining and nullish coalescing to handle possible nulls
                                const textNode = inputRef.current?.firstChild || inputRef.current
                                if (textNode) {
                                    newRange.setStart(textNode, Math.min(startOffset, (value || "").length))
                                }

                                selection.removeAllRanges()
                                selection.addRange(newRange)
                            } catch (e) {
                                console.error("Error restoring selection:", e)
                            }
                        }, 0)
                    }
                }
            }
        }, [value, isControlled])

        React.useEffect(() => {
            if (defaultValue && inputRef.current && !isControlled && !localValue) {
                inputRef.current.textContent = defaultValue
                setLocalValue(defaultValue)
            }
        }, [defaultValue, localValue, isControlled])

        const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
            if (disabled) return

            const target = e.currentTarget
            const newValue = target.textContent || ""
            const selection = window.getSelection()
            let cursorPosition = selection?.focusOffset || 0

            if (maxLength && newValue.length > maxLength) {
                const truncated = newValue.slice(0, maxLength)
                target.textContent = truncated
                setLocalValue(truncated)

                // Preserve cursor position after truncation
                if (selection) {
                    setTimeout(() => {
                        try {
                            const range = document.createRange()
                            const textNode = target.firstChild || target

                            // Make sure we have a valid text node
                            if (textNode.nodeType !== Node.TEXT_NODE && target.firstChild) {
                                // If the first child isn't a text node but exists, use it
                                range.setStart(target.firstChild, Math.min(cursorPosition, maxLength))
                            } else {
                                // Otherwise use the node itself with position 0
                                range.setStart(textNode, Math.min(cursorPosition, maxLength))
                            }

                            range.collapse(true)
                            selection.removeAllRanges()
                            selection.addRange(range)
                        } catch (e) {
                            console.error("Error setting cursor position:", e)
                        }
                    }, 0)
                }

                onChange?.(truncated)
                return
            }

            if (!isControlled) {
                setLocalValue(newValue)
            }

            // Always preserve cursor position after any input change
            if (selection) {
                const focusNode = selection.focusNode
                cursorPosition = selection.focusOffset

                // Schedule cursor position restoration after React updates
                setTimeout(() => {
                    try {
                        // Only attempt to restore if the element still has focus
                        if (document.activeElement === target) {
                            const range = document.createRange()

                            // Find the appropriate node to place cursor
                            let nodeToUse = focusNode

                            // If the focus node is no longer in the DOM or not part of our input
                            if (!target.contains(focusNode)) {
                                nodeToUse = target.firstChild || target
                            }

                            // Set cursor position
                            range.setStart(nodeToUse as Node, Math.min(cursorPosition, newValue.length))
                            range.collapse(true)

                            selection.removeAllRanges()
                            selection.addRange(range)
                        }
                    } catch (e) {
                        console.error("Error restoring cursor position after input:", e)
                    }
                }, 0)
            }

            onChange?.(newValue)
        }

        const handleContainerClick = (e: React.MouseEvent) => {
            if (disabled) return
            if (e.target === e.currentTarget) {
                inputRef.current?.focus()
                setIsFocused(true)

                // Create range and get selection safely
                const selection = window.getSelection()
                if (!selection || !inputRef.current) return

                try {
                    const range = document.createRange()
                    const textNode = inputRef.current.firstChild || inputRef.current
                    const textLength = inputRef.current.textContent?.length || 0

                    if (inputRef.current.contains(textNode)) {
                        range.setStart(textNode, textLength)
                        range.collapse(true)
                        selection.removeAllRanges()
                        selection.addRange(range)
                    }
                } catch (e) {
                    console.error("Error setting selection in handleContainerClick:", e)
                }
            }
        }

        // Update the handleFocus function to ensure cursor is positioned at the end when focusing
        const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
            if (!disabled) {
                setIsFocused(true)
                onFocus?.(e)

                // Position cursor at the end when focusing
                const selection = window.getSelection()
                if (selection && inputRef.current) {
                    try {
                        const range = document.createRange()
                        const textNode = inputRef.current.firstChild || inputRef.current
                        const textLength = inputRef.current.textContent?.length || 0

                        // Ensure we're setting the cursor at the end of the content
                        range.setStart(textNode, textLength)
                        range.collapse(true)

                        // Apply the selection
                        selection.removeAllRanges()
                        selection.addRange(range)
                    } catch (e) {
                        console.error("Error positioning cursor at end on focus:", e)
                    }
                }
            }
        }

        const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
            setIsFocused(false)
            if (inputRef.current) {
                const currentValue = inputRef.current.textContent || ""
                setLocalValue(currentValue)
            }
            onBlur?.(e)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onEnter?.()
            }

            // Special handling for backspace to ensure cursor position is maintained
            if (e.key === "Backspace") {
                const selection = window.getSelection()
                const position = selection?.focusOffset || 0

                // Store the current position and node for restoration after React updates
                if (selection && selection.focusNode) {
                    const focusNode = selection.focusNode

                    // Use setTimeout to run after the current event loop
                    setTimeout(() => {
                        try {
                            if (document.activeElement === inputRef.current) {
                                const range = document.createRange()

                                // If the original node is still valid and in the DOM
                                if (inputRef.current?.contains(focusNode)) {
                                    range.setStart(focusNode, Math.max(0, position - 1))
                                } else {
                                    // Fallback to the first child or the div itself
                                    const textNode = inputRef.current?.firstChild || inputRef.current
                                    if (textNode) {
                                        const newPos = Math.max(0, (inputRef.current?.textContent?.length || 0) - 1)
                                        range.setStart(textNode, newPos)
                                    }
                                }

                                range.collapse(true)
                                selection.removeAllRanges()
                                selection.addRange(range)
                            }
                        } catch (e) {
                            console.error("Error restoring cursor after backspace:", e)
                        }
                    }, 0)
                }
            }
        }


        return (
            <div
                className={cn(
                    inputVariants({ variant, inputSize, state: computedState }),
                    "outline-none whitespace-pre-wrap break-words leading-normal flex items-center min-h-[inherit]",
                    !localValue &&
                    !value &&
                    "before:content-[attr(data-placeholder)] before:text-muted-foreground before:opacity-50 before:absolute before:pointer-events-none before:top-1/2 before:-translate-y-1/2",
                    icon && iconPosition === "left" && "pl-10",
                    icon && iconPosition === "right" && "pr-10",
                    className,
                )}
            >
                {icon && iconPosition === "left" && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
                )}
                <div
                    ref={mergedRef}
                    role="textbox"
                    contentEditable={!disabled}
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onClick={handleContainerClick}
                    className="w-full outline-none"
                    data-placeholder={placeholder}
                    tabIndex={disabled ? -1 : 0}
                    aria-disabled={disabled}
                    aria-multiline="true"
                    {...props}
                />
                {icon && iconPosition === "right" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
                )}
            </div>
        )
    },
)

CustomInput.displayName = "CustomInput"

export { CustomInput }
