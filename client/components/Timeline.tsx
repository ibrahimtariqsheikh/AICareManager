import React from 'react';

export function Timeline() {
    return (
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200/30 -translate-x-1/2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                <div
                    key={number}
                    className="font-bold absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500/20 backdrop-blur-lg flex items-center justify-center text-primary font-semibold"
                    style={{
                        top: `${(number - 1) * 12.5}%`,
                    }}
                >
                    {number}
                </div>
            ))}
        </div>
    );
}
