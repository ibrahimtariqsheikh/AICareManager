import type { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// User-related functions
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, agencyId } = req.query;
    console.log("getUsers");
    console.log("role", role);
    console.log("agencyId", agencyId);

    // Build where clause for filtering
    const where: any = {};
    if (role) where.role = role as Role;
    if (agencyId) where.agencyId = agencyId as string;

    console.log("Fetching users with where clause:", where);

    // Get users with filtering
    const users = await prisma.user.findMany({
      where,
      include: {
        profile: {
          select: {
            avatarUrl: true,
            phone: true,
          },
        },
      },
      orderBy: {
        firstName: "asc",
      },
    });

    // Add color field for UI
    const usersWithColor = users.map((user) => ({
      ...user,
      color: getRandomColor(user.id),
    }));

    // Return formatted response
    res.json({
      data: usersWithColor,
      meta: {
        total: users.length,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get filtered users for scheduling
export const getFilteredUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("getFilteredUsers");
    const { inviterId } = req.params;
    
    const users = await prisma.user.findMany({
      where: {
        invitedById: inviterId,
      },
    });

    const careWorkers = users.filter((user) => user.role === Role.CARE_WORKER);
    const clients = users.filter((user) => user.role === Role.CLIENT);
    const officeStaff = users.filter((user) => user.role === Role.OFFICE_STAFF);

    res.json({
      careWorkers,
      clients,
      officeStaff,
    });
  } catch (error) {
    console.error("Error fetching filtered users:", error);
    res.status(500).json({ message: "Error fetching filtered users", error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId, email, firstName, lastName, role } = req.body;
        console.log("cognitoId", cognitoId);
        console.log("email", email);
        const user = await prisma.user.create({
            data: { 
                cognitoId, 
                email, 
                firstName, 
                lastName, 
                role: role as Role 
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { cognitoId } = req.params;
    console.log("cognitoId", cognitoId);
    const user = await prisma.user.findUnique({
        where: { cognitoId },
    });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user);
};

// Client-related functions
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("getClients");
    const { status, userId } = req.query;

    // Build where clause for filtering
    const where: any = {};
    if (status) where.status = status as string;

    // If userId is provided, check user's permissions

    console.log("userId", userId);
    console.log("status", status);
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId as string },
        include: {
          agency: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      // Admin and software owner have access to all clients
      if (user.role !== Role.ADMIN && user.role !== Role.SOFTWARE_OWNER) {
        // If user has an agency, they can see clients from that agency
        if (user.agencyId) {
          where.agencyId = user.agencyId;
        } else {
          // User has no agency and is not admin, return empty result
          res.json({
            data: [],
            meta: { total: 0 },
          });
          return;
        }
      }
    }

    console.log("Fetching clients with where clause:", where);

    // Get clients with filtering
    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        addressLine1: true,
        townOrCity: true,
        postalCode: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    // Format clients for the frontend
    const formattedClients = clients.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
  
      status: "Active", // Default status
      dateAdded: client.createdAt,
      color: getRandomColor(client.id),
      profile: {
        avatarUrl: null, // No avatarUrl in your schema for clients
      },
    }));

    // Return formatted response
    res.json({
      data: formattedClients,
      meta: {
        total: clients.length,
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

// Helper function to get a random color based on ID
function getRandomColor(id: string): string {
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
