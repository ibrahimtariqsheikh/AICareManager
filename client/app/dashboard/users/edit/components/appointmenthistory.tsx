import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { User } from "@/types/prismaTypes"

const AppointmentHistory = ({ user }: { user: User }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <h2>Appointment 1</h2>
                    <p>Date: 1/1/2021</p>
                    <p>Time: 10:00 AM</p>
                    <p>Type: Check-up</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default AppointmentHistory