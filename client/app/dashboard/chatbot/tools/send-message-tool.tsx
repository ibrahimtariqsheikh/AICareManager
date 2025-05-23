import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SendMessageToolProps {
    onSubmit: (data: { message: string; channel: 'SMS' | 'EMAIL' }) => void;
}

export function SendMessageTool({ onSubmit }: SendMessageToolProps) {
    const [message, setMessage] = useState('');
    const [channel, setChannel] = useState<'SMS' | 'EMAIL'>('SMS');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ message, channel });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Send Message to Care Workers</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message"
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Channel</Label>
                        <RadioGroup value={channel} onValueChange={(value) => setChannel(value as 'SMS' | 'EMAIL')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SMS" id="sms" />
                                <Label htmlFor="sms">SMS</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="EMAIL" id="email" />
                                <Label htmlFor="email">Email</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full">
                        Send Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 