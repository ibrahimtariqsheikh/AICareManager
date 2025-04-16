"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, ImageIcon, File } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
    onFileSelect: (file: File) => void
    onCancel: () => void
    accept?: string
    maxSize?: number // in MB
    className?: string
}

export function FileUpload({
    onFileSelect,
    onCancel,
    accept = "image/*",
    maxSize = 10,
    className
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Check file size
        if (selectedFile.size > maxSize * 1024 * 1024) {
            setError(`File size exceeds ${maxSize}MB limit`)
            return
        }

        setError(null)
        setFile(selectedFile)

        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleUpload = () => {
        if (!file) return

        setIsUploading(true)

        // Simulate upload progress
        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            setProgress(progress)

            if (progress >= 100) {
                clearInterval(interval)
                setIsUploading(false)
                onFileSelect(file)
            }
        }, 200)
    }

    const handleCancel = () => {
        setFile(null)
        setPreview(null)
        setProgress(0)
        setError(null)
        if (inputRef.current) inputRef.current.value = ''
        onCancel()
    }

    const getFileIcon = () => {
        if (!file) return <Upload className="h-8 w-8 text-muted-foreground" />

        if (file.type.startsWith('image/')) {
            return <ImageIcon className="h-8 w-8" />
        } else if (file.type.includes('pdf')) {
            return <FileText className="h-8 w-8" />
        } else {
            return <File className="h-8 w-8" />
        }
    }

    return (
        <div className={cn("p-4 rounded-lg border", className)}>
            <div className="flex flex-col items-center gap-4">
                {!file ? (
                    <>
                        <div className="p-4 rounded-full bg-muted">
                            {getFileIcon()}
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">Drag and drop or click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {accept === "image/*" ? "PNG, JPG or GIF up to " : "Files up to "}
                                {maxSize}MB
                            </p>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <Button
                            variant="outline"
                            onClick={() => inputRef.current?.click()}
                            className="mt-2"
                        >
                            Select file
                        </Button>
                    </>
                ) : (
                    <div className="w-full">
                        {preview ? (
                            <div className="relative w-full aspect-video mb-4">
                                <img
                                    src={preview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="rounded-md object-cover w-full h-full border"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute top-2 right-2 h-6 w-6 bg-background"
                                    onClick={handleCancel}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 mb-4">
                                {getFileIcon()}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleCancel}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {isUploading ? (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-center text-muted-foreground">
                                    Uploading... {progress}%
                                </p>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUpload}
                                    className="flex-1"
                                >
                                    Upload
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                )}
            </div>
        </div>
    )
}
