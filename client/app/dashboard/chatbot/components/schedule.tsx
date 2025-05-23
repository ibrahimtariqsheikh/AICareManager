import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleItem {
    time: string;
    title: string;
    description?: string | undefined;
    location?: string | undefined;
}

interface ScheduleProps {
    date: string;
    items: ScheduleItem[];
    isLoading?: boolean;
    onAddSchedule?: (data: {
        date: string;
        startTime: string;
        endTime: string;
        clientName: string;
        careWorkerName: string;
        notes?: string;
        location?: string;
    }) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ date, items, isLoading = false, onAddSchedule }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        date: date || new Date().toLocaleDateString(),
        startTime: '',
        endTime: '',
        clientName: '',
        careWorkerName: '',
        notes: '',
        location: ''
    });

    if (isLoading) {
        return (
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-purple-200 dark:bg-purple-800 rounded w-1/3"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded"></div>
                        <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                {!isAdding ? (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">No Schedule Available</h3>
                        <p className="text-sm text-muted-foreground">Would you like to add a new schedule?</p>
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Add Schedule
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        onAddSchedule?.(formData);
                        setIsAdding(false);
                    }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Client Name</Label>
                                <Input
                                    id="clientName"
                                    value={formData.clientName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="careWorkerName">Care Worker Name</Label>
                                <Input
                                    id="careWorkerName"
                                    value={formData.careWorkerName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, careWorkerName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location (Optional)</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAdding(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Save Schedule
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-lg mb-3">{date}</h3>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="w-20 shrink-0 text-sm text-muted-foreground">
                            {item.time}
                        </div>
                        <div>
                            <h4 className="font-medium">{item.title}</h4>
                            {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            )}
                            {item.location && (
                                <p className="text-sm text-muted-foreground">{item.location}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 