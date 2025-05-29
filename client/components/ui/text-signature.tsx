import * as React from "react"
import { cn } from "@/lib/utils"
import { CustomInput } from "./custom-input"

export interface TextSignatureProps {
    id: string
    onSignatureChange: (hasSignature: boolean) => void
    className?: string
    placeholder?: string
}

const TextSignature = React.forwardRef<HTMLDivElement, TextSignatureProps>(
    ({ onSignatureChange, className, placeholder = "Type your signature here..." }, ref) => {
        const [signature, setSignature] = React.useState("")
        const [hasSignature, setHasSignature] = React.useState(false)

        const handleChange = (value: string) => {
            setSignature(value)
            const hasValue = value.trim().length > 0
            setHasSignature(hasValue)
            onSignatureChange(hasValue)
        }

        return (
            <div className={cn("border border-dashed border-neutral-200 rounded-lg bg-white", className)} ref={ref}>
                <div className="p-4">
                    <CustomInput
                        value={signature}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="font-signature text-2xl tracking-wider"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 border-t">
                    <button
                        onClick={() => {
                            setSignature("")
                            setHasSignature(false)
                            onSignatureChange(false)
                        }}
                        className="text-xs text-neutral-500 hover:text-neutral-700"
                    >
                        Clear
                    </button>
                    <span className={`text-[11px] font-medium ${hasSignature ? "text-green-600" : "text-neutral-500"}`}>
                        {hasSignature ? "Signed ✓" : "Not Signed"}
                    </span>
                </div>
            </div>
        )
    }
)

TextSignature.displayName = "TextSignature"

export { TextSignature } 