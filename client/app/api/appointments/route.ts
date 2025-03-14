import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, you would query your database with Prisma
  // For example:
  // const clients = await prisma.client.findMany({
  //   select: {
  //     id: true,
  //     firstName: true,
  //     lastName: true,
  //     phoneNumber: true,
  //     addressLine1: true,
  //     townOrCity: true,
  //     postalCode: true
  //   }
  // })

  // Mock data for demonstration
  const clients = [
    {
      id: "client-1",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-123-4567",
      addressLine1: "123 Main St",
      townOrCity: "Anytown",
      postalCode: "12345",
    },
    {
      id: "client-2",
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "555-987-6543",
      addressLine1: "456 Oak Ave",
      townOrCity: "Somewhere",
      postalCode: "67890",
    },
    {
      id: "client-3",
      firstName: "Robert",
      lastName: "Johnson",
      phoneNumber: "555-456-7890",
      addressLine1: "789 Pine Rd",
      townOrCity: "Nowhere",
      postalCode: "54321",
    },
    {
      id: "client-4",
      firstName: "Emily",
      lastName: "Davis",
      phoneNumber: "555-789-0123",
      addressLine1: "321 Elm St",
      townOrCity: "Elsewhere",
      postalCode: "09876",
    },
    {
      id: "client-5",
      firstName: "Michael",
      lastName: "Brown",
      phoneNumber: "555-234-5678",
      addressLine1: "654 Maple Dr",
      townOrCity: "Anywhere",
      postalCode: "13579",
    },
  ]

  return NextResponse.json(clients)
}

