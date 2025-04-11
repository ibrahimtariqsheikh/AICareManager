export default function Loading() {
    return (
        <div className="p-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Calendar View Toggle Skeleton */}
            <div className="flex items-center gap-2 mb-6">
                {["Day", "Week", "Month"].map((view) => (
                    <div key={view} className="h-9 w-20 bg-muted rounded animate-pulse" />
                ))}
            </div>

            {/* Calendar Grid Skeleton */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="h-8 bg-muted rounded animate-pulse" />
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
                ))}
            </div>

            {/* Sidebar Skeleton */}
            <div className="fixed right-0 top-0 h-full w-80 border-l bg-card p-6 hidden lg:block">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-32 w-full bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
} 