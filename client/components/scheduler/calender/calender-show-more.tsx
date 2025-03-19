"use client"

interface CustomShowMoreProps {
    events: any[]
    date: Date
    onViewMoreClick: (date: Date) => void
}

export function CustomShowMore({ events, date, onViewMoreClick }: CustomShowMoreProps) {
    const count = events.length
    return (
        <button
            className="view-more-button bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium"
            onClick={() => onViewMoreClick(date)}
        >
            +{count} more
        </button>
    )
}

