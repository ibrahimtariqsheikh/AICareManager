"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreVertical, Download, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"

interface Document {
    id: string
    name: string
    type: string
    uploadedAt: string
}

interface DocumentListProps {
    documents: Document[]
    onDelete: (id: string) => void
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

    const handleDeleteClick = (document: Document) => {
        setSelectedDocument(document)
        setDeleteDialogOpen(true)
    }

    const handlePreviewClick = (document: Document) => {
        setSelectedDocument(document)
        setPreviewDialogOpen(true)
    }

    const confirmDelete = () => {
        if (selectedDocument) {
            onDelete(selectedDocument.id)
            setDeleteDialogOpen(false)
            setSelectedDocument(null)
        }
    }

    const getDocumentTypeBadge = (type: string) => {
        switch (type) {
            case "operational_documents":
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                    >
                        Operational
                    </Badge>
                )
            case "policies":
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    >
                        Policy
                    </Badge>
                )
            case "procedures":
                return (
                    <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                    >
                        Procedure
                    </Badge>
                )
            case "training":
                return (
                    <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                    >
                        Training
                    </Badge>
                )
            case "forms":
                return (
                    <Badge
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"
                    >
                        Form
                    </Badge>
                )
            default:
                return <Badge variant="outline">Other</Badge>
        }
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-8 border rounded-md bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No documents yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload your first document to get started</p>
            </div>
        )
    }

    return (
        <>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map((document) => (
                            <TableRow key={document.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {document.name}
                                </TableCell>
                                <TableCell>{getDocumentTypeBadge(document.type)}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {format(new Date(document.uploadedAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handlePreviewClick(document)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteClick(document)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] sm:h-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedDocument?.name}</DialogTitle>
                        <DialogDescription>Document preview</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 h-[400px] border rounded-md bg-muted/10 flex items-center justify-center">
                        {/* In a real app, you would embed a PDF viewer or document preview here */}
                        <div className="text-center">
                            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                Preview not available in this demo. In a real application, the document would be displayed here.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
