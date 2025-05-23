import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface OnboardingInviteToolProps {
    onSubmit: (data: { name: string; email: string; include_training: boolean }) => void;
}

export function OnboardingInviteTool({ onSubmit }: OnboardingInviteToolProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [includeTraining, setIncludeTraining] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, email, include_training: includeTraining });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Send Onboarding Invite</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Carer Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter carer name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="training"
                            checked={includeTraining}
                            onCheckedChange={(checked) => setIncludeTraining(checked as boolean)}
                        />
                        <Label htmlFor="training">Include Training Materials</Label>
                    </div>

                    <Button type="submit" className="w-full">
                        Send Invite
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 