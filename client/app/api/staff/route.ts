import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, you would query your database with Prisma
  // For example:
  // const staff = await prisma.user.findMany({
  //   where: {
  //     role: "CARE_WORKER"
  //   },
  //   select: {
  //     id: true,
  //     firstName: true,
  //     lastName: true,
  //     email: true,
  //     subRole: true
  //   }
  // })

  // Mock data for demonstration
  const staff = [
    {
      id: "staff-1",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      role: "CARE_WORKER",
      subRole: "SENIOR_CAREGIVER",
    },
    {
      id: "staff-2",
      firstName: "David",
      lastName: "Thompson",
      email: "david.thompson@example.com",
      role: "CARE_WORKER",
      subRole: "NURSING_ASSISTANT",
    },
    {
      id: "staff-3",
      firstName: "Lisa",
      lastName: "Martinez",
      email: "lisa.martinez@example.com",
      role: "CARE_WORKER",
      subRole: "SPECIALIZED_CAREGIVER",
    },
    {
      id: "staff-4",
      firstName: "James",
      lastName: "Taylor",
      email: "james.taylor@example.com",
      role: "CARE_WORKER",
      subRole: "CAREGIVER",
    },
  ]

  return NextResponse.json(staff)
}

