"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva("flex w-full rounded-md border bg-background text-foreground transition-colors relative", {
    variants: {
        variant: {
            default: "border text-black border-neutral-200 text-sm bg-neutral-100/50",
            ghost: "border-none bg-transparent shadow-none",
            outline: "border-input ring-offset-background",
        },
        inputSize: {
            default: "h-10",
            sm: "h-8 text-sm",
            lg: "h-12 text-lg",
        },
        state: {
            default: "hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
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
            ...props
        },
        ref,
    ) => {
        const inputRef = React.useRef<HTMLDivElement>(null)
        const mergedRef = useMergedRef(ref, inputRef)

        const [localValue, setLocalValue] = React.useState(defaultValue)
        const [isFocused, setIsFocused] = React.useState(false)
        const isControlled = value !== undefined

        // Determine state based on props
        const computedState = React.useMemo(() => {
            if (disabled) return "disabled"
            if (error) return "error"
            if (success) return "success"
            return state
        }, [disabled, error, success, state])

        // Handle controlled component without disrupting cursor
        React.useEffect(() => {
            if (isControlled && inputRef.current) {
                // Only update if the value has actually changed
                const currentText = inputRef.current.textContent || ""
                if (value !== currentText) {
                    // Store selection
                    const selection = window.getSelection()
                    const range = selection?.getRangeAt(0)
                    const startOffset = range?.startOffset || 0

                    // Update content
                    inputRef.current.textContent = value
                    setLocalValue(value)

                    // Restore selection if element is focused
                    if (document.activeElement === inputRef.current && selection && range) {
                        setTimeout(() => {
                            try {
                                // Create a new range
                                const newRange = document.createRange()
                                // Position cursor in the appropriate location
                                newRange.setStart(inputRef.current!.firstChild || inputRef.current!,
                                    Math.min(startOffset, (value || "").length))
                                newRange.collapse(true)

                                // Apply the selection
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

        // Handle initial default value
        React.useEffect(() => {
            if (defaultValue && inputRef.current && !isControlled && !localValue) {
                inputRef.current.textContent = defaultValue
                setLocalValue(defaultValue)
            }
        }, [defaultValue, localValue, isControlled])

        // Handle content changes from the editable div
        const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
            if (disabled) return

            const target = e.currentTarget
            const newValue = target.textContent || ""

            // Enforce maxLength
            if (maxLength && newValue.length > maxLength) {
                // Save cursor position
                const selection = window.getSelection()
                const position = selection?.focusOffset || 0

                // Truncate the value
                const truncated = newValue.slice(0, maxLength)
                target.textContent = truncated
                setLocalValue(truncated)

                // Restore cursor at the right position
                if (selection) {
                    setTimeout(() => {
                        try {
                            const range = document.createRange()
                            const textNode = target.firstChild || target
                            const validPos = Math.min(position, maxLength)
                            range.setStart(textNode, validPos)
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

            // Update internal state if not controlled
            if (!isControlled) {
                setLocalValue(newValue)
            }

            onChange?.(newValue)
        }

        // Focus the div when clicked on the container
        const handleContainerClick = (e: React.MouseEvent) => {
            if (disabled) return
            if (e.target === e.currentTarget) { // Only if clicking the container but not the input
                inputRef.current?.focus()

                // Place cursor at the end
                const range = document.createRange()
                const selection = window.getSelection()
                if (inputRef.current && selection) {
                    const textNode = inputRef.current.firstChild || inputRef.current
                    const textLength = inputRef.current.textContent?.length || 0
                    range.setStart(textNode, textLength)
                    range.collapse(true)
                    selection.removeAllRanges()
                    selection.addRange(range)
                }
            }
        }

        const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
            if (!disabled) {
                setIsFocused(true)
                onFocus?.(e)
            }
        }

        const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
            setIsFocused(false)
            // Ensure we update localValue on blur to correctly handle placeholder visibility
            if (inputRef.current) {
                const currentValue = inputRef.current.textContent || "";
                setLocalValue(currentValue);
            }
            onBlur?.(e)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            // Handle Enter key to behave like a standard input
            if (e.key === 'Enter') {
                e.preventDefault()
            }
        }

        // Determine if we should show the placeholder
        const shouldShowPlaceholder = (!isControlled && (!localValue || localValue.trim() === "")) ||
            (isControlled && (!value || value.trim() === ""));

        return (
            <div
                className={cn(inputVariants({ variant, inputSize, state: computedState, className }))}
                onClick={handleContainerClick}
                data-state={isFocused ? "focused" : ""}
                data-disabled={disabled ? "" : undefined}
                {...props}
            >
                <div
                    ref={mergedRef}
                    className={cn("w-full h-full px-3 py-2 outline-none break-words flex items-center")}
                    contentEditable={!disabled}
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    tabIndex={disabled ? -1 : 0}
                    role="textbox"
                    aria-multiline="false"
                    data-placeholder={placeholder}
                    aria-disabled={disabled}
                    spellCheck="false"
                    data-name={name}
                    style={{
                        direction: "ltr",
                        textAlign: "left",
                        unicodeBidi: "plaintext",
                    }}
                />

                {shouldShowPlaceholder && !isFocused && (
                    <div className="absolute top-0 left-0 px-3 py-2 text-muted-foreground pointer-events-none flex items-center h-full">
                        {placeholder}
                    </div>
                )}
            </div>
        )
    },
)

CustomInput.displayName = "CustomInput"

// Helper hook to merge refs
function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
    return React.useCallback(
        (value: T) => {
            for (const ref of refs) {
                if (typeof ref === "function") {
                    ref(value)
                } else if (ref) {
                    ; (ref as React.MutableRefObject<T>).current = value
                }
            }
        },
        [refs],
    )
}

export { CustomInput }