import React from 'react';

interface WeatherProps {
    temperature: number;
    condition: string;
    location: string;
    icon?: string;
}

export const Weather: React.FC<WeatherProps> = ({ temperature, condition, location, icon }) => {
    return (
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
                {icon && <img src={icon} alt={condition} className="w-12 h-12" />}
                <div>
                    <h3 className="font-semibold text-lg">{location}</h3>
                    <p className="text-sm text-muted-foreground">{condition}</p>
                    <p className="text-2xl font-bold">{temperature}°C</p>
                </div>
            </div>
        </div>
    );
}; 