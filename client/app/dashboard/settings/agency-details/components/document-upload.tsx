"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"

interface DocumentUploadProps {
    onUpload: (file: File) => void
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [documentType, setDocumentType] = useState("operational_documents")
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        if (file) {
            onUpload(file)
            setFile(null)
            setDocumentType("operational_documents")
            setOpen(false)
        }
    }

    const handleButtonClick = () => {
        inputRef.current?.click()
    }

    const removeFile = () => {
        setFile(null)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Upload a document to share with your care workers. Supported formats: PDF, DOC, DOCX.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="documentType">Document Type</Label>
                        <Select value={documentType} onValueChange={setDocumentType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="operational_documents">Operational Documents</SelectItem>
                                <SelectItem value="policies">Policies</SelectItem>
                                <SelectItem value="procedures">Procedures</SelectItem>
                                <SelectItem value="training">Training Materials</SelectItem>
                                <SelectItem value="forms">Forms</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Document File</Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                } ${file ? "bg-muted/20" : ""}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {file ? (
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium truncate max-w-[300px]">{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={removeFile}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="rounded-full bg-muted p-3">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm font-medium">Drag and drop your file here</p>
                                        <p className="text-xs text-muted-foreground">or</p>
                                        <Button type="button" variant="link" onClick={handleButtonClick}>
                                            Browse files
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                                </div>
                            )}
                            <Input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleChange} className="hidden" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!file}>
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
