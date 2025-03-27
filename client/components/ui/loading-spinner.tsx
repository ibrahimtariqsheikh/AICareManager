import { Loader } from "lucide-react";

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

