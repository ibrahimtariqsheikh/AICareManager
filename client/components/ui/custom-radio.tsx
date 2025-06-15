import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

const CustomRadio = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    )
})
CustomRadio.displayName = RadioGroupPrimitive.Root.displayName

const CustomRadioItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
        color?: "emerald" | "red" | "gray"
    }
>(({ className, color = "gray", ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-current text-current ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                {
                    "border-emerald-400 text-emerald-400": color === "emerald",
                    "border-red-500 text-red-500": color === "red",
                    "border-gray-200 text-gray-200": color === "gray",
                },
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    {
                        "bg-emerald-400": color === "emerald",
                        "bg-red-500": color === "red",
                        "bg-gray-200": color === "gray",
                    }
                )} />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
})
CustomRadioItem.displayName = RadioGroupPrimitive.Item.displayName

export { CustomRadio, CustomRadioItem } 