import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CarePlanToolProps {
    onSubmit: (data: { client_name: string; care_type: string; condition: string }) => void;
}

export function CarePlanTool({ onSubmit }: CarePlanToolProps) {
    const [clientName, setClientName] = useState('');
    const [careType, setCareType] = useState('');
    const [condition, setCondition] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ client_name: clientName, care_type: careType, condition });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Generate Care Plan Draft</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                            id="clientName"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Enter client name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="careType">Care Type</Label>
                        <Input
                            id="careType"
                            value={careType}
                            onChange={(e) => setCareType(e.target.value)}
                            placeholder="Enter type of care required"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="condition">Medical Condition</Label>
                        <Textarea
                            id="condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            placeholder="Describe the client's medical condition"
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Generate Care Plan
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 