import React from "react"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={`w-full h-11 px-3 rounded-md 
                        border-2 border-gray-200
                        hover:border-gray-300
                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                        transition-all duration-200
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        )
    }
)

CustomInput.displayName = "CustomInput"

export default CustomInput 