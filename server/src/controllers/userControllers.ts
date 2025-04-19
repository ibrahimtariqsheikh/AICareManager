import { Request, Response } from "express";
import { PrismaClient, Role, SubRole } from "@prisma/client";
import crypto from "crypto";

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
        fullName: "asc",
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
        const { email, role, subRole, fullName, cognitoId, agencyId } = req.body;

        // Validate required fields
        if (!email || !role) {
            res.status(400).json({ error: "Email and role are required" });
            return;
        }

        // Validate role
        if (!Object.values(Role).includes(role)) {
            res.status(400).json({ error: "Invalid role" });
            return;
        }

        // Validate subrole if provided
        if (subRole && !Object.values(SubRole).includes(subRole)) {
            res.status(400).json({ error: "Invalid subrole" });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        // Create user in database
        const user = await prisma.user.create({
            data: {
                email,
                fullName: fullName || "",
                role,
                subRole,
                cognitoId: cognitoId || crypto.randomBytes(16).toString("hex"),
                agencyId
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { cognitoId } = req.params;
    console.log("cognitoId", cognitoId);
    try {
        const user = await prisma.user.findUnique({
            where: { cognitoId },
            include: {
                agency: true,
                profile: true,
               
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Client-related functions
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("getClients");
    const { status, userId } = req.query;

    // Build where clause for filtering
    const where: any = {
      role: Role.CLIENT
    };
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
    const clients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });

    // Format clients for the frontend
    const formattedClients = clients.map((client: { 
      id: string;
      fullName: string;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      id: client.id,
      fullName: client.fullName,
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

// Get users by agency
export const getAgencyUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { agencyId } = req.params;
        
        if (!agencyId) {
            res.status(400).json({ error: "Agency ID is required" });
            return;
        }

        const users = await prisma.user.findMany({
            where: {
                agencyId: agencyId
            },
            include: {
                profile: {
                    select: {
                        avatarUrl: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                fullName: "asc",
            },
        });

        // Add color field for UI
        const usersWithColor = users.map((user) => ({
            ...user,
            color: getRandomColor(user.id),
        }));

        res.json({
            data: usersWithColor,
            meta: {
                total: users.length,
            },
        });
    } catch (error) {
        console.error("Error fetching agency users:", error);
        res.status(500).json({ error: "Failed to fetch agency users" });
    }
};

export const getUserAllDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                agency: true,
                documents: true,
                incidentReports: true,
                keyContacts: true,
                careOutcomes: true,
                riskAssessments: true,
                familyAccess: true,
                communicationLogs: true,
             
            },
        });
        res.json({data: user}); 
    } catch (error) {
        console.error("Error fetching user all details:", error);
        res.status(500).json({ error: "Failed to fetch user all details" });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: {
                    select: {
                        avatarUrl: true,
                        phone: true,
                    },
                },
                agency: true,
                keyContacts: true,
                careOutcomes: true,
                incidentReports: true,
                riskAssessments: true,
                familyAccess: true,
                communicationLogs: true,
                documents: true,
                
            },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Add color field for UI
        const userWithColor = {
            ...user,
            color: getRandomColor(user.id),
        };

        res.json({
            data: userWithColor,
            meta: {
                total: 1,
            },
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { email, role, subRole, fullName, agencyId } = req.body;

        // Validate role if provided
        if (role && !Object.values(Role).includes(role)) {
            res.status(400).json({ error: "Invalid role" });
            return;
        }

        // Validate subrole if provided
        if (subRole && !Object.values(SubRole).includes(subRole)) {
            res.status(400).json({ error: "Invalid subrole" });
            return;
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({
                where: { email },
            });

            if (emailTaken) {
                res.status(400).json({ error: "Email already taken" });
                return;
            }
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email: email || undefined,
                fullName: fullName || undefined,
                role: role || undefined,
                subRole: subRole || undefined,
                agencyId: agencyId || undefined,
            },
            include: {
                profile: {
                    select: {
                        avatarUrl: true,
                        phone: true,
                    },
                },
                agency: true,
            },
        });

        // Add color field for UI
        const userWithColor = {
            ...updatedUser,
            color: getRandomColor(updatedUser.id),
        };

        res.json({
            data: userWithColor,
            meta: {
                total: 1,
            },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

// Helper function to get a random color based on ID
function getRandomColor(id: string): string {
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
