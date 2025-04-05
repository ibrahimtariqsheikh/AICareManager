import { useMutation, useQuery } from "@tanstack/react-query"
import { Role, SubRole } from "../types/prismaTypes"

export const useCreateUserMutation = () => {
    return useMutation({
        mutationFn: async (userData: { email: string; role: Role; subRole?: SubRole }) => {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
            if (!response.ok) {
                throw new Error("Failed to create user")
            }
            return response.json()
        },
    })
}

export const useGetUsersQuery = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch("/api/users")
            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }
            return response.json()
        },
    })
} 