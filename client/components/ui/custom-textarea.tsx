import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    error?: string
    label?: string
    description?: string
    className?: string
    containerClassName?: string
    onChange?: (value: string) => void
}

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
    ({ className, containerClassName, error, label, description, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (onChange) {
                onChange(e.target.value)
            }
        }

        return (
            <div className={cn("space-y-2", containerClassName)}>
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    onChange={handleChange}
                    {...props}
                />
                {description && !error && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        )
    }
)

CustomTextarea.displayName = "CustomTextarea"

export { CustomTextarea } 