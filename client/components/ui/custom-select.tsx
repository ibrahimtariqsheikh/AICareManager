"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const selectVariants = cva("flex w-full rounded-md border bg-background text-foreground transition-colors relative", {
    variants: {
        variant: {
            default: cn("border text-black border-neutral-200 text-sm bg-neutral-100/50", "dark:text-white dark:border-neutral-800 dark:bg-neutral-900/50"),
            ghost: "border-none bg-transparent shadow-none",
            outline: cn("border-input ring-offset-background", "dark:border-neutral-800"),
        },
        selectSize: {
            default: "h-10",
            sm: "h-8 text-sm",
            lg: "h-12 text-lg",
        },
        state: {
            default: cn(
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "dark:focus-within:ring-primary dark:focus-within:ring-offset-2"
            ),
            error: "border-destructive focus-within:ring-destructive",
            success: "border-green-500 focus-within:ring-green-500",
            disabled: "opacity-50 cursor-not-allowed",
        },
    },
    defaultVariants: {
        variant: "default",
        selectSize: "default",
        state: "default",
    },
})

const dropdownVariants = cva(
    "absolute z-50 w-full mt-1 rounded-md border overflow-hidden bg-background",
    {
        variants: {
            position: {
                bottom: "top-full",
                top: "bottom-full",
            },
            maxHeight: {
                default: "max-h-60",
                sm: "max-h-40",
                lg: "max-h-80",
            },
        },
        defaultVariants: {
            position: "bottom",
            maxHeight: "default",
        },
    },
)

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface CustomSelectProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof selectVariants> {
    options: SelectOption[]
    onChange?: (value: string) => void
    disabled?: boolean
    value?: string | undefined
    defaultValue?: string | undefined
    error?: boolean
    success?: boolean
    name?: string
    placeholder?: string
    dropdownPosition?: "top" | "bottom"
    maxHeight?: "default" | "sm" | "lg"
    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void
    id?: string
    required?: boolean
    reducedMotion?: boolean
}

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

// Custom hook to detect reduced motion preference
function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = () => {
            setPrefersReducedMotion(mediaQuery.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    return prefersReducedMotion
}

const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
    (
        {
            className,
            variant,
            selectSize,
            state,
            options,
            onChange,
            disabled = false,
            value,
            defaultValue,
            error = false,
            success = false,
            name,
            placeholder = "Select an option",
            dropdownPosition = "bottom",
            maxHeight = "default",
            onBlur,
            onFocus,
            reducedMotion: propReducedMotion,
            ...props
        },
        ref,
    ) => {
        const containerRef = React.useRef<HTMLDivElement>(null)
        const dropdownRef = React.useRef<HTMLDivElement>(null)
        const mergedRef = useMergedRef(ref, containerRef)
        const systemReducedMotion = useReducedMotion()
        // Use prop if provided, otherwise use system preference
        const prefersReducedMotion = propReducedMotion !== undefined ? propReducedMotion : systemReducedMotion

        const [isOpen, setIsOpen] = React.useState(false)
        const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")
        const [isFocused, setIsFocused] = React.useState(false)
        const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
        const isControlled = value !== undefined

        // Determine state based on props
        const computedState = React.useMemo(() => {
            if (disabled) return "disabled"
            if (error) return "error"
            if (success) return "success"
            return state
        }, [disabled, error, success, state])

        // Handle controlled component
        React.useEffect(() => {
            if (isControlled && value !== selectedValue) {
                setSelectedValue(value)
            }
        }, [value, isControlled, selectedValue])

        // Find the selected option label
        const selectedLabel = React.useMemo(() => {
            const selectedOption = options.find((option) => option.value === selectedValue)
            return selectedOption ? selectedOption.label : ""
        }, [options, selectedValue])

        // Handle click outside to close dropdown
        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node) &&
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false)
                }
            }

            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside)
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [isOpen])

        // Handle escape key to close dropdown
        React.useEffect(() => {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    setIsOpen(false)
                }
            }

            if (isOpen) {
                document.addEventListener("keydown", handleEscape)
            }

            return () => {
                document.removeEventListener("keydown", handleEscape)
            }
        }, [isOpen])

        const toggleDropdown = () => {
            if (!disabled) {
                setIsOpen((prev) => !prev)
                if (!isOpen) {
                    containerRef.current?.focus()
                }
            }
        }

        const handleOptionSelect = (optionValue: string, isDisabled = false) => {
            if (disabled || isDisabled) return

            if (!isControlled) {
                setSelectedValue(optionValue)
            }

            setIsOpen(false)
            onChange?.(optionValue)
        }

        const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
            if (!disabled) {
                setIsFocused(true)
                onFocus?.(e)
            }
        }

        const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
            // Only blur if not clicking inside the dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
                setIsFocused(false)
                onBlur?.(e)
            }
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (disabled) return

            switch (e.key) {
                case "Enter":
                case " ":
                    e.preventDefault()
                    toggleDropdown()
                    break
                case "ArrowDown":
                    e.preventDefault()
                    if (!isOpen) {
                        setIsOpen(true)
                    } else {
                        // Find the next non-disabled option
                        const currentIndex = options.findIndex((option) => option.value === selectedValue)
                        const nextIndex = findNextEnabledOption(options, currentIndex)
                        if (nextIndex !== -1 && options[nextIndex]) {
                            setHoveredIndex(nextIndex)
                            handleOptionSelect(options[nextIndex].value)
                        }
                    }
                    break
                case "ArrowUp":
                    e.preventDefault()
                    if (!isOpen) {
                        setIsOpen(true)
                    } else {
                        // Find the previous non-disabled option
                        const currentIndex = options.findIndex((option) => option.value === selectedValue)
                        const prevIndex = findPrevEnabledOption(options, currentIndex)
                        if (prevIndex !== -1 && options[prevIndex]) {
                            setHoveredIndex(prevIndex)
                            handleOptionSelect(options[prevIndex].value)
                        }
                    }
                    break
                case "Tab":
                    setIsOpen(false)
                    break
            }
        }

        // Helper function to find next enabled option
        const findNextEnabledOption = (options: SelectOption[], currentIndex: number): number => {
            if (currentIndex === -1) return options.findIndex((option) => !option.disabled)

            for (let i = currentIndex + 1; i < options.length; i++) {
                if (options[i] && !(options[i] as SelectOption).disabled) return i
            }

            // Loop back to beginning if we reach the end
            for (let i = 0; i <= currentIndex; i++) {
                if (options[i] && !(options[i] as SelectOption).disabled) return i
            }

            return -1
        }

        // Helper function to find previous enabled option
        const findPrevEnabledOption = (options: SelectOption[], currentIndex: number): number => {
            if (currentIndex === -1) {
                // Find the last non-disabled option
                for (let i = options.length - 1; i >= 0; i--) {
                    if (options[i] && !(options[i] as SelectOption).disabled) return i
                }
                return -1
            }

            for (let i = currentIndex - 1; i >= 0; i--) {
                if (options[i] && !(options[i] as SelectOption).disabled) return i
            }

            // Loop back to end if we reach the beginning
            for (let i = options.length - 1; i >= currentIndex; i--) {
                if (options[i] && !(options[i] as SelectOption).disabled) return i
            }

            return -1
        }

        // Calculate container styles based on state
        const containerClasses = cn(
            selectVariants({ variant, selectSize, state: computedState, className }),
            "transition-all duration-200 ease-out",
            !disabled && cn(
                "hover:bg-black/[0.02] hover:border-black/[0.15]",
                "dark:hover:bg-white/[0.02] dark:hover:border-white/[0.15]"
            ),
            (isFocused || isOpen) && cn(
                "border-black/25 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]",
                "dark:border-white/25 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
            ),
            !disabled && "active:scale-[0.995]"
        )

        // Determine dropdown classes
        const dropdownClasses = cn(
            dropdownVariants({ position: dropdownPosition, maxHeight }),
            "transition-all",
            prefersReducedMotion ? "duration-100" : "duration-200",
            "ease-out",
            cn(
                "shadow-lg shadow-black/5 backdrop-blur-sm",
                "dark:shadow-white/5 dark:bg-neutral-900 dark:border-neutral-800"
            ),
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            dropdownPosition === "bottom"
                ? (isOpen ? "translate-y-0" : "-translate-y-2")
                : (isOpen ? "translate-y-0" : "translate-y-2")
        )

        return (
            <div className="relative" {...props}>
                <div
                    ref={mergedRef}
                    className={containerClasses}
                    onClick={toggleDropdown}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    tabIndex={disabled ? -1 : 0}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-controls={isOpen ? `select-dropdown-${name || ""}` : undefined}
                    aria-disabled={disabled}
                    data-state={isFocused ? "focused" : ""}
                    data-disabled={disabled ? "" : undefined}
                    data-name={name}
                >
                    <div className="flex items-center justify-between w-full h-full px-3 py-2 outline-none">
                        <div className={cn("text-left truncate", !selectedValue && "text-muted-foreground")}>
                            {selectedLabel || placeholder}
                        </div>
                        <div className={cn(
                            "transition-transform duration-200 ease-out",
                            isOpen && "rotate-180"
                        )}>
                            <ChevronDown size={18} className="shrink-0 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                <div
                    ref={dropdownRef}
                    id={`select-dropdown-${name || ""}`}
                    className={dropdownClasses}
                    role="listbox"
                    style={{
                        transformOrigin: dropdownPosition === "bottom" ? "top" : "bottom",
                        boxShadow: "0 4px 25px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div className="py-1 overflow-y-auto max-h-[inherit]">
                        {options.map((option, index) => {
                            const isSelected = option.value === selectedValue
                            const isHovered = hoveredIndex === index
                            const isDisabled = !!option.disabled
                            const optionDelay = prefersReducedMotion ? "0s" : `${index * 0.02}s`

                            return (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "px-3 py-2 cursor-pointer flex items-center relative text-sm",
                                        "transition-all ease-out",
                                        prefersReducedMotion ? "duration-100" : "duration-200",
                                        isOpen && isSelected && cn("bg-black/5", "dark:bg-white/5"),
                                        isOpen && isHovered && !isDisabled && !isSelected && cn("bg-black/3", "dark:bg-white/3"),
                                        !isDisabled && cn("hover:bg-black/5 active:scale-[0.98]", "dark:hover:bg-white/5"),
                                        isSelected && "font-medium",
                                        isDisabled && "opacity-50 cursor-not-allowed text-muted-foreground",
                                        // Animation styles
                                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                                    )}
                                    onClick={() => handleOptionSelect(option.value, isDisabled)}
                                    onMouseEnter={() => !isDisabled && setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    role="option"
                                    aria-selected={isSelected}
                                    aria-disabled={isDisabled}
                                    style={{
                                        transitionDelay: isOpen ? optionDelay : "0s"
                                    }}
                                >
                                    {option.label}
                                </div>
                            )
                        })}
                        {options.length === 0 && (
                            <div
                                className={cn(
                                    "px-3 py-2 text-muted-foreground italic",
                                    "transition-all duration-200 ease-out",
                                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                )}
                            >
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    },
)

CustomSelect.displayName = "CustomSelect"

export { CustomSelect }