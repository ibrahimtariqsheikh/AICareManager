import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToolInvocation } from 'ai';
import { Loader2 } from 'lucide-react';

export function PayrollTool(toolInvocation: ToolInvocation) {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call") {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating payroll...
            </div>
        );
    }

    if (toolInvocation.state === "result" && 'result' in toolInvocation) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Payroll Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Month</Label>
                            <div className="font-medium">{toolInvocation.result.month}</div>
                        </div>
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <div className="font-medium">{toolInvocation.result.year}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Generate Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
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
                        Generate Payroll
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 