"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

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
    isPassword?: boolean
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
            isPassword = false,
            type = "text",
            ...props
        },
        ref,
    ) => {
        const inputRef = React.useRef<HTMLDivElement>(null)
        const mergedRef = useMergedRef(ref, inputRef)
        const [showPassword, setShowPassword] = React.useState(false)
        const [localValue, setLocalValue] = React.useState(defaultValue)
        const [, setIsFocused] = React.useState(false)
        const [actualPasswordValue, setActualPasswordValue] = React.useState(defaultValue)
        const cursorPositionRef = React.useRef(0)
        const isControlled = value !== undefined

        // Determine state based on props
        const computedState = React.useMemo(() => {
            if (disabled) return "disabled"
            if (error) return "error"
            if (success) return "success"
            return state
        }, [disabled, error, success, state])

        // Get the actual value to work with
        const actualValue = isControlled ? (value || "") : (isPassword ? actualPasswordValue : localValue)

        // Function to update the display content
        const updateDisplayContent = React.useCallback((val: string, preserveCursor = false) => {
            if (!inputRef.current) return

            let startOffset = 0
            const selection = window.getSelection()

            // Store cursor position if preserving
            if (preserveCursor && selection && selection.rangeCount > 0) {
                try {
                    const range = selection.getRangeAt(0)
                    startOffset = range?.startOffset || 0
                } catch (e) {
                    console.error("Error accessing selection range:", e)
                }
            }

            // Set the display content
            const displayContent = isPassword && !showPassword ? "•".repeat(val.length) : val
            inputRef.current.textContent = displayContent

            // Restore cursor position if needed
            if (preserveCursor && document.activeElement === inputRef.current && selection) {
                setTimeout(() => {
                    try {
                        const newRange = document.createRange()
                        const textNode = inputRef.current?.firstChild || inputRef.current
                        if (textNode) {
                            newRange.setStart(textNode, Math.min(startOffset, val.length))
                            newRange.collapse(true)
                        }
                        selection.removeAllRanges()
                        selection.addRange(newRange)
                    } catch (e) {
                        console.error("Error restoring selection:", e)
                    }
                }, 0)
            }
        }, [isPassword, showPassword])

        // Update display when controlled value changes
        React.useEffect(() => {
            if (isControlled && inputRef.current) {
                const currentText = inputRef.current.textContent || ""
                const expectedDisplay = isPassword && !showPassword ? "•".repeat(value?.length || 0) : (value || "")

                if (currentText !== expectedDisplay) {
                    updateDisplayContent(value || "", true)
                    setLocalValue(value || "")
                }
            }
        }, [value, isControlled, isPassword, showPassword, updateDisplayContent])

        // Update display when password visibility toggles
        React.useEffect(() => {
            if (isPassword && inputRef.current) {
                updateDisplayContent(actualValue, true)
            }
        }, [showPassword, isPassword, actualValue, updateDisplayContent])

        // Initialize default value
        React.useEffect(() => {
            if (defaultValue && inputRef.current && !isControlled && !localValue) {
                updateDisplayContent(defaultValue)
                setLocalValue(defaultValue)
                if (isPassword) {
                    setActualPasswordValue(defaultValue)
                }
            }
        }, [defaultValue, localValue, isControlled, updateDisplayContent, isPassword])

        const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
            if (disabled) return

            // For password fields with hidden text, we handle input via keyDown instead
            if (isPassword && !showPassword) {
                return
            }

            const target = e.currentTarget
            const newValue = target.textContent || ""
            const selection = window.getSelection()
            let cursorPosition = selection?.focusOffset || 0

            if (maxLength && newValue.length > maxLength) {
                const truncated = newValue.slice(0, maxLength)
                const newCursorPos = Math.min(cursorPosition, maxLength)

                if (!isControlled) {
                    setLocalValue(truncated)
                }

                target.textContent = truncated

                // Restore cursor position after truncation
                setTimeout(() => {
                    try {
                        const range = document.createRange()
                        const textNode = target.firstChild || target
                        range.setStart(textNode, newCursorPos)
                        range.collapse(true)
                        selection?.removeAllRanges()
                        selection?.addRange(range)
                    } catch (e) {
                        console.error("Error setting cursor position:", e)
                    }
                }, 0)

                onChange?.(truncated)
                return
            }

            if (!isControlled) {
                setLocalValue(newValue)
            }

            onChange?.(newValue)
        }

        const handleContainerClick = (e: React.MouseEvent) => {
            if (disabled) return
            if (e.target === e.currentTarget) {
                inputRef.current?.focus()
                setIsFocused(true)

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

        const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
            if (!disabled) {
                setIsFocused(true)
                onFocus?.(e)

                const selection = window.getSelection()
                if (selection && inputRef.current) {
                    try {
                        const range = document.createRange()
                        const textNode = inputRef.current.firstChild || inputRef.current
                        const textLength = inputRef.current.textContent?.length || 0

                        range.setStart(textNode, textLength)
                        range.collapse(true)

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
            if (inputRef.current && !isPassword) {
                const currentValue = inputRef.current.textContent || ""
                setLocalValue(currentValue)
            }
            onBlur?.(e)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            // Update cursor position ref before any processing
            const selection = window.getSelection()
            const currentCursorPos = selection?.focusOffset || 0
            cursorPositionRef.current = currentCursorPos

            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onEnter?.()
                return
            }

            // Special handling for password fields
            if (isPassword && !showPassword) {

                if (e.key === "Backspace") {
                    e.preventDefault()
                    if (currentCursorPos > 0) {
                        const newValue = actualValue.slice(0, currentCursorPos - 1) + actualValue.slice(currentCursorPos)

                        if (!isControlled) {
                            setActualPasswordValue(newValue)
                            setLocalValue(newValue)
                        }

                        // Update display immediately
                        if (inputRef.current) {
                            inputRef.current.textContent = "•".repeat(newValue.length)
                        }

                        onChange?.(newValue)

                        // Set cursor position
                        const newCursorPos = Math.max(0, currentCursorPos - 1)
                        cursorPositionRef.current = newCursorPos
                        setTimeout(() => {
                            try {
                                if (inputRef.current && document.activeElement === inputRef.current) {
                                    const range = document.createRange()
                                    const textNode = inputRef.current.firstChild || inputRef.current
                                    if (textNode) {
                                        range.setStart(textNode, newCursorPos)
                                        range.collapse(true)
                                        selection?.removeAllRanges()
                                        selection?.addRange(range)
                                    }
                                }
                            } catch (e) {
                                console.error("Error setting cursor position:", e)
                            }
                        }, 0)
                    }
                } else if (e.key === "Delete") {
                    e.preventDefault()
                    if (currentCursorPos < actualValue.length) {
                        const newValue = actualValue.slice(0, currentCursorPos) + actualValue.slice(currentCursorPos + 1)

                        if (!isControlled) {
                            setActualPasswordValue(newValue)
                            setLocalValue(newValue)
                        }

                        // Update display immediately
                        if (inputRef.current) {
                            inputRef.current.textContent = "•".repeat(newValue.length)
                        }

                        onChange?.(newValue)

                        // Keep cursor at same position
                        setTimeout(() => {
                            try {
                                if (inputRef.current && document.activeElement === inputRef.current) {
                                    const range = document.createRange()
                                    const textNode = inputRef.current.firstChild || inputRef.current
                                    if (textNode) {
                                        range.setStart(textNode, currentCursorPos)
                                        range.collapse(true)
                                        selection?.removeAllRanges()
                                        selection?.addRange(range)
                                    }
                                }
                            } catch (e) {
                                console.error("Error setting cursor position:", e)
                            }
                        }, 0)
                    }
                } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    // Regular character input
                    e.preventDefault()

                    const newValue = actualValue.slice(0, currentCursorPos) + e.key + actualValue.slice(currentCursorPos)

                    if (maxLength && newValue.length > maxLength) {
                        return // Don't add if exceeds max length
                    }

                    if (!isControlled) {
                        setActualPasswordValue(newValue)
                        setLocalValue(newValue)
                    }

                    // Update display immediately
                    if (inputRef.current) {
                        inputRef.current.textContent = "•".repeat(newValue.length)
                    }

                    onChange?.(newValue)

                    // Move cursor forward to the position after the inserted character
                    const newCursorPos = currentCursorPos + 1
                    cursorPositionRef.current = newCursorPos
                    setTimeout(() => {
                        try {
                            if (inputRef.current && document.activeElement === inputRef.current) {
                                const range = document.createRange()
                                const textNode = inputRef.current.firstChild || inputRef.current
                                if (textNode) {
                                    range.setStart(textNode, Math.min(newCursorPos, newValue.length))
                                    range.collapse(true)
                                    selection?.removeAllRanges()
                                    selection?.addRange(range)
                                }
                            }
                        } catch (e) {
                            console.error("Error setting cursor position:", e)
                        }
                    }, 0)
                } else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                    // Allow navigation keys to work normally and update our cursor tracking
                    setTimeout(() => {
                        const newSelection = window.getSelection()
                        cursorPositionRef.current = newSelection?.focusOffset || 0
                    }, 0)
                }
                return
            }

            // Regular handling for non-password fields
            if (e.key === "Backspace") {
                const position = selection?.focusOffset || 0

                if (selection && selection.focusNode) {
                    const focusNode = selection.focusNode

                    setTimeout(() => {
                        try {
                            if (document.activeElement === inputRef.current) {
                                const range = document.createRange()

                                if (inputRef.current?.contains(focusNode)) {
                                    range.setStart(focusNode, Math.max(0, position - 1))
                                } else {
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

        const togglePasswordVisibility = (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setShowPassword(!showPassword)
        }

        return (
            <div
                className={cn(
                    inputVariants({ variant, inputSize, state: computedState }),
                    "outline-none whitespace-pre-wrap break-words leading-normal flex items-center min-h-[inherit]",
                    !actualValue &&
                    "before:content-[attr(data-placeholder)] before:text-muted-foreground before:opacity-50 before:absolute before:pointer-events-none before:top-1/2 before:-translate-y-1/2",
                    icon && iconPosition === "left" && "pl-10",
                    icon && iconPosition === "right" && "pr-10",
                    isPassword && "pr-10",
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
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
        )
    },
)

CustomInput.displayName = "CustomInput"

export { CustomInput }