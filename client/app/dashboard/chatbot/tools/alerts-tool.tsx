import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AlertsToolProps {
    onSubmit: (data: { month: string; year: string }) => void;
}

export function AlertsTool({ onSubmit }: AlertsToolProps) {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ month, year });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>View Unresolved Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="month">Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                            id="year"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="2000"
                            max="2100"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        View Alerts
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 