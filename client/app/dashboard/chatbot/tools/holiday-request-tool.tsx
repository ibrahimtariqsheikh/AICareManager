import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HolidayRequestToolProps {
    onSubmit: (data: { week: string }) => void;
}

export function HolidayRequestTool({ onSubmit }: HolidayRequestToolProps) {
    const [week, setWeek] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ week });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>View Holiday Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="week">Week</Label>
                        <Input
                            id="week"
                            type="week"
                            value={week}
                            onChange={(e) => setWeek(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        View Requests
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 