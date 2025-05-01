export const StatusLegend = () => {
    return (
        <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
                <div className="h-4 w-4 rounded-full bg-green-500" />
                <span>Taken</span>
            </div>
            <div className="flex items-center space-x-1">
                <div className="h-4 w-4 rounded-full bg-red-500" />
                <span>Not taken</span>
            </div>
            <div className="flex items-center space-x-1">
                <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                <span>Not reported</span>
            </div>
            <div className="flex items-center space-x-1">
                <div className="h-4 w-4 rounded-full bg-gray-200" />
                <span>Not scheduled</span>
            </div>
        </div>
    )
}
