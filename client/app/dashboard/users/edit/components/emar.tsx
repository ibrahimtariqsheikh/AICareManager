import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/types/prismaTypes"

export const EMAR = ({ user }: { user: User }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>EMAR</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <h2>EMAR 1</h2>
                    <p>Date: 1/1/2021</p>
                    <p>Time: 10:00 AM</p>
                </div>
            </CardContent>
        </Card>
    )
}