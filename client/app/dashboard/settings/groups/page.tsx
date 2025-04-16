"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, Users, UserMinus } from "lucide-react"
import { ClientGroupList } from "./components/client-group-list"
import { ClientSelector } from "./components/client-selector"
import { useAppSelector } from "@/hooks/useAppSelector"

import { useGetGroupsQuery, useCreateGroupMutation, useUpdateGroupMutation, useDeleteGroupMutation } from "@/state/api"
import type { Client, ClientGroup } from "./types"
import { EmptyState } from "./components/empty-state"
import { Group } from "@/types/prismaTypes"

export default function ClientGroupsPage() {

    const agencyId = useAppSelector((state) => state.user.user.userInfo?.agencyId)
    const { data: groupsData, isLoading, refetch } = useGetGroupsQuery(agencyId as string)
    const [createGroup] = useCreateGroupMutation()
    const [updateGroup] = useUpdateGroupMutation()
    const [deleteGroup] = useDeleteGroupMutation()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentGroup, setCurrentGroup] = useState<ClientGroup | null>(null)
    const [groupName, setGroupName] = useState("")
    const [selectedClients, setSelectedClients] = useState<Client[]>([])
    const [nameError, setNameError] = useState("")

    const clientGroups: Group[] = groupsData || []

    const resetForm = () => {
        setGroupName("")
        setSelectedClients([])
        setNameError("")
        setCurrentGroup(null)
    }

    const handleOpenDialog = (group?: ClientGroup) => {
        if (group) {
            setCurrentGroup(group)
            setGroupName(group.name)
            setSelectedClients(group.clients)
        } else {
            resetForm()
        }
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        resetForm()
    }

    const validateForm = () => {
        let isValid = true

        if (!groupName.trim()) {
            setNameError("Group name is required")
            isValid = false
        } else {
            setNameError("")
        }

        if (selectedClients.length === 0) {
            toast.error("Please select at least one client for the group")
            isValid = false
        }

        return isValid
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        if (!agencyId) {
            toast.error("Agency ID is required")
            return
        }

        try {
            const clientIds = selectedClients.map(client => client.id)
            const groupData = {
                name: groupName,
                clientIds
            }

            if (currentGroup) {
                await updateGroup({
                    agencyId,
                    groupId: currentGroup.id,
                    ...groupData
                }).unwrap()
                toast.success("Client group updated successfully")
            } else {
                await createGroup({
                    agencyId,
                    ...groupData
                }).unwrap()
                toast.success("Client group created successfully")
            }

            refetch()
            handleCloseDialog()
        } catch (error: any) {
            console.error("Error saving group:", error)
            const errorMessage = error.data?.message || error.message || "Failed to save group. Please try again."
            const errorDetails = error.data?.details || error.data?.error || ""
            const errorCode = error.data?.code || ""

            // Log the full error for debugging
            console.error("Full error details:", {
                message: errorMessage,
                details: errorDetails,
                code: errorCode,
                fullError: error
            })

            // Show the error message with details if available
            if (errorDetails) {
                toast.error(`${errorMessage}\n${errorDetails}`)
            } else {
                toast.error(errorMessage)
            }
        }
    }

    const handleOpenDeleteDialog = (group: ClientGroup) => {
        setCurrentGroup(group)
        setIsDeleteDialogOpen(true)
    }

    const handleDelete = async () => {
        if (currentGroup && currentGroup.id && agencyId) {
            try {
                await deleteGroup({ agencyId, groupId: currentGroup.id }).unwrap()
                toast.success("Client group deleted successfully")
                refetch()
            } catch (error) {
                toast.error("Failed to delete group. Please try again.")
                console.error("Error deleting group:", error)
            }
        }
        setIsDeleteDialogOpen(false)
        setCurrentGroup(null)
    }

    const handleClientSelect = (client: Client) => {
        if (selectedClients.some((c) => c.id === client.id)) {
            setSelectedClients(selectedClients.filter((c) => c.id !== client.id))
        } else {
            setSelectedClients([...selectedClients, client])
        }
    }

    const handleRemoveClient = (clientId: string) => {
        setSelectedClients(selectedClients.filter((c) => c.id !== clientId))
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Client Groups</h1>
                <p className="text-muted-foreground">
                    Create and manage groups of clients who live together or have other relationships
                </p>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900">All Groups</h2>
                    <p className="text-sm text-neutral-700">
                        {clientGroups.length} group{clientGroups.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Group</span>
                </Button>
            </div>

            {clientGroups.length === 0 ? (
                <EmptyState
                    title="No Client Groups"
                    description="Create your first client group to organize clients who live together or have other relationships"
                    icon={<Users className="h-10 w-10 text-muted-foreground" />}
                    action={
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Group
                        </Button>
                    }
                />
            ) : (
                <ClientGroupList groups={clientGroups} onEdit={handleOpenDialog} onDelete={handleOpenDeleteDialog} />
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{currentGroup ? "Edit Client Group" : "Create Client Group"}</DialogTitle>
                        <DialogDescription>
                            {currentGroup
                                ? "Update the details for this client group"
                                : "Create a new group for clients who live together or have other relationships"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Group Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Smith Household, Johnson Family"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Selected Clients ({selectedClients.length})</Label>
                            {selectedClients.length > 0 ? (
                                <div className="border rounded-md p-2 max-h-[120px] overflow-y-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedClients.map((client) => (
                                            <Badge key={client.id} variant="secondary" className="flex items-center gap-1 py-1.5">
                                                {client.firstName} {client.lastName}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveClient(client.id)}
                                                    className="ml-1 text-muted-foreground hover:text-foreground"
                                                >
                                                    <UserMinus className="h-3 w-3" />
                                                    <span className="sr-only">
                                                        Remove {client.firstName} {client.lastName}
                                                    </span>
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="border rounded-md p-4 text-center text-muted-foreground">
                                    No clients selected. Please select clients below.
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Add Clients to Group</Label>
                            <ClientSelector
                                onClientSelect={handleClientSelect}
                                selectedClientIds={selectedClients.map(c => c.id)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {currentGroup ? "Update Group" : "Create Group"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Group</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this group? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
