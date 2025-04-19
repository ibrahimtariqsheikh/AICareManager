import { Card } from "@/components/ui/card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/types/prismaTypes"

export const MedicalHistory = ({ user }: { user: User }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <h2>Medical History 1</h2>
                </div>
            </CardContent>
        </Card>
    )
}