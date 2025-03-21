import type React from "react"
const ScheduleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-screen max-w-full overflow-x-hidden">
            <div className="w-full max-w-full overflow-x-auto">{children}</div>
        </div>
    )
}

export default ScheduleLayout

