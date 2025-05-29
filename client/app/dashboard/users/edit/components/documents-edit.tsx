import { Eye, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Trash2 } from "lucide-react";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { MyCustomDateRange } from "@/app/dashboard/billing/components/my-custom-date-range";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";

import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

import { format } from "date-fns";

// Document category enum
const DocumentCategory = z.enum(['identity', 'care', 'medical', 'legal', 'financial', 'incident']);
type DocumentCategory = z.infer<typeof DocumentCategory>;

// Document schema
export const DocumentSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    category: DocumentCategory,
    uploadDate: z.string(),
    uploadedBy: z.string(),
    expiryDate: z.string().optional(),
});

// Form data schema
export const DocumentFormSchema = z.object({
    name: z.string().min(1, "Document name is required"),
    type: z.string().min(1, "Document type is required"),
    category: DocumentCategory,
    expiryDate: z.string().optional(),
    reviewDate: z.string().optional(),
    shareWith: z.array(z.string()).default([]),
});

export type Document = z.infer<typeof DocumentSchema>;
export type DocumentFormData = z.infer<typeof DocumentFormSchema>;

const sampleDocuments: Document[] = [
    {
        id: '1',
        name: 'Care Plan - Ahmed Raza',
        type: 'Care Plan',
        category: 'care',
        uploadDate: '2024-01-15',
        uploadedBy: 'Sarah Johnson',
        expiryDate: '2024-07-15'
    },
    {
        id: '2',
        name: 'Risk Assessment Report',
        type: 'Assessment',
        category: 'care',
        uploadDate: '2024-01-10',
        uploadedBy: 'Michael Brown',
        expiryDate: '2024-06-10'
    },
    {
        id: '3',
        name: 'DBS Certificate',
        type: 'Legal',
        category: 'legal',
        uploadDate: '2023-12-01',
        uploadedBy: 'Admin User',
        expiryDate: '2024-01-01'
    },
    {
        id: '4',
        name: 'Passport Copy',
        type: 'Identity',
        category: 'identity',
        uploadDate: '2024-01-05',
        uploadedBy: 'Sarah Johnson',
        expiryDate: '2028-05-15'
    },
    {
        id: '5',
        name: 'Current Medication List',
        type: 'Medical',
        category: 'medical',
        uploadDate: '2024-01-20',
        uploadedBy: 'Dr. Smith'
    },
    {
        id: '6',
        name: 'Direct Payment Agreement',
        type: 'Financial',
        category: 'financial',
        uploadDate: '2023-12-15',
        uploadedBy: 'Finance Team',
        expiryDate: '2024-12-15'
    }
];

const DocumentsEdit = () => {
    const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(sampleDocuments);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <div className="relative">
            <div className="max-w-7xl mx-auto space-y-4">
                <DocumentFilters
                    documents={documents}
                    onFilteredDocuments={setFilteredDocuments}
                />

                <DocumentTable
                    documents={filteredDocuments}
                    onDocumentUpdate={setDocuments}
                />

                <UploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={(newDocument) => {
                        const documentWithId = { ...newDocument, id: Date.now().toString() };
                        setDocuments(prev => [documentWithId, ...prev]);
                        setFilteredDocuments(prev => [documentWithId, ...prev]);
                    }}
                />
            </div>

            {/* FAB Button */}
            <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
                <Upload className="h-6 w-6" />
            </Button>
        </div>
    );
};

export default DocumentsEdit;

interface DocumentFiltersProps {
    documents: Document[];
    onFilteredDocuments: (filtered: Document[]) => void;
}

export const DocumentFilters = ({ documents, onFilteredDocuments }: DocumentFiltersProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();

    useEffect(() => {
        let filtered = documents;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Type filter
        if (typeFilter !== "all") {
            filtered = filtered.filter(doc => doc.category === typeFilter);
        }

        // Date range filter
        if (dateRange?.from) {
            filtered = filtered.filter(doc => new Date(doc.uploadDate) >= dateRange.from);
        }
        if (dateRange?.to) {
            filtered = filtered.filter(doc => new Date(doc.uploadDate) <= dateRange.to);
        }

        onFilteredDocuments(filtered);
    }, [searchTerm, typeFilter, dateRange, documents, onFilteredDocuments]);

    const typeOptions = [
        { value: "all", label: "All Types" },
        { value: "identity", label: "Identity Documents" },
        { value: "care", label: "Care Documentation" },
        { value: "medical", label: "Medical Records" },
        { value: "legal", label: "Legal & Compliance" },
        { value: "financial", label: "Financial" },
        { value: "incident", label: "Incident Management" }
    ];

    return (
        <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-medium text-slate-700">
                        Search
                    </Label>
                    <CustomInput
                        id="search"
                        placeholder="Document name or type..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Type</Label>
                    <CustomSelect
                        options={typeOptions}
                        value={typeFilter}
                        onChange={setTypeFilter}
                        placeholder="All Types"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Date Range</Label>
                    <MyCustomDateRange
                        onRangeChange={setDateRange}
                        placeholder="Select date range"
                    />
                </div>
            </div>
        </Card>
    );
};


interface DocumentTableProps {
    documents: Document[];
    onDocumentUpdate: (documents: Document[]) => void;
}

export const DocumentTable = ({ documents, onDocumentUpdate }: DocumentTableProps) => {
    const [sortField, setSortField] = useState<'uploadDate' | 'expiryDate' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: 'uploadDate' | 'expiryDate') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedDocuments = [...documents].sort((a, b) => {
        if (!sortField) return 0;

        const dateA = new Date(a[sortField] || '');
        const dateB = new Date(b[sortField] || '');

        if (sortDirection === 'asc') {
            return dateA.getTime() - dateB.getTime();
        } else {
            return dateB.getTime() - dateA.getTime();
        }
    });

    const getTypeBadge = (category: string, type: string) => {
        const baseClass = "text-xs font-medium px-2 py-1 rounded-sm ";
        switch (category) {
            case 'identity':
                return <span className={`${baseClass} bg-blue-100 text-blue-800`}>{type}</span>;
            case 'care':
                return <span className={`${baseClass} bg-emerald-100 text-emerald-800`}>{type}</span>;
            case 'medical':
                return <span className={`${baseClass} bg-amber-100 text-amber-800`}>{type}</span>;
            case 'legal':
                return <span className={`${baseClass} bg-indigo-100 text-indigo-800`}>{type}</span>;
            case 'financial':
                return <span className={`${baseClass} bg-pink-100 text-pink-800`}>{type}</span>;
            case 'incident':
                return <span className={`${baseClass} bg-red-100 text-red-800`}>{type}</span>;
            default:
                return <span className={`${baseClass} bg-gray-100 text-gray-800`}>{type}</span>;
        }
    };

    const handleDelete = (documentId: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            onDocumentUpdate(documents.filter(doc => doc.id !== documentId));
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">Document Name</TableHead>
                        <TableHead className="font-semibold text-slate-700">Type</TableHead>
                        <TableHead className="font-semibold text-slate-700">Uploaded By</TableHead>
                        <TableHead
                            className="font-semibold text-slate-700 cursor-pointer"
                            onClick={() => handleSort('uploadDate')}
                        >
                            <div className="flex items-center gap-2">
                                Uploaded Date
                                <ArrowUpDown className="h-4 w-4" />
                                {sortField === 'uploadDate' && (
                                    <span className="text-xs text-slate-500">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        </TableHead>

                        <TableHead
                            className="font-semibold text-slate-700 cursor-pointer"
                            onClick={() => handleSort('expiryDate')}
                        >
                            <div className="flex items-center gap-2">
                                Expiry Date
                                <ArrowUpDown className="h-4 w-4" />
                                {sortField === 'expiryDate' && (
                                    <span className="text-xs text-slate-500">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedDocuments.map((document) => (
                        <TableRow key={document.id} className="hover:bg-slate-50">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-slate-900">{document.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {getTypeBadge(document.category, document.type)}
                            </TableCell>
                            <TableCell className="text-slate-600">
                                {document.uploadedBy}
                            </TableCell>
                            <TableCell className="text-slate-600">
                                {formatDate(document.uploadDate)}
                            </TableCell>

                            <TableCell className="text-slate-600">
                                {document.expiryDate ? formatDate(document.expiryDate) : '-'}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <span className="text-lg">⋯</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Document
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600 focus:text-red-600"
                                            onClick={() => handleDelete(document.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {documents.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 opacity-50">📄</div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No documents found</h3>
                    <p className="text-slate-600">Try adjusting your filters or upload a new document.</p>
                </div>
            )}
        </Card>
    );
};

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (document: Omit<Document, 'id'>) => void;
}

export const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
    const [formData, setFormData] = useState<DocumentFormData>({
        name: '',
        type: '',
        category: 'identity',
        expiryDate: '',
        reviewDate: '',
        shareWith: []
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const documentTypes = [
        {
            category: 'identity', label: 'Identity Documents', options: [
                { value: 'passport', label: 'Passport' },
                { value: 'driving_license', label: 'Driving License' },
                { value: 'birth_certificate', label: 'Birth Certificate' },
                { value: 'proof_of_address', label: 'Proof of Address' }
            ]
        },
        {
            category: 'care', label: 'Care Documentation', options: [
                { value: 'care_plan', label: 'Care Plan' },
                { value: 'risk_assessment', label: 'Risk Assessment' },
                { value: 'support_plan', label: 'Support Plan' },
                { value: 'needs_assessment', label: 'Needs Assessment' }
            ]
        },
        {
            category: 'medical', label: 'Medical Records', options: [
                { value: 'gp_records', label: 'GP Records' },
                { value: 'medication_list', label: 'Medication List' },
                { value: 'hospital_discharge', label: 'Hospital Discharge Summary' },
                { value: 'mental_health', label: 'Mental Health Assessment' }
            ]
        },
        {
            category: 'legal', label: 'Legal & Compliance', options: [
                { value: 'dbs_check', label: 'DBS Check' },
                { value: 'insurance', label: 'Insurance Certificate' },
                { value: 'contract', label: 'Contract/Agreement' },
                { value: 'consent_forms', label: 'Consent Forms' }
            ]
        },
        {
            category: 'financial', label: 'Financial', options: [
                { value: 'payment_agreement', label: 'Direct Payment Agreement' },
                { value: 'invoices', label: 'Invoices' },
                { value: 'payment_records', label: 'Payment Records' }
            ]
        },
        {
            category: 'incident', label: 'Incident Management', options: [
                { value: 'incident_report', label: 'Incident Report' },
                { value: 'safeguarding_alert', label: 'Safeguarding Alert' },
                { value: 'complaint_record', label: 'Complaint Record' }
            ]
        }
    ];

    const handleFileSelect = (file: File) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'image/jpeg',
            'image/png'
        ];

        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('Please upload PDF, DOCX, DOC, JPG, or PNG files only');
            return;
        }

        setSelectedFile(file);
        if (!formData.name) {
            setFormData(prev => ({
                ...prev,
                name: file.name.split('.')[0] || ''
            }));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        try {
            // Validate form data
            const validatedData = DocumentFormSchema.parse(formData);

            const selectedOption = documentTypes
                .flatMap(group => group.options)
                .find(option => option.value === validatedData.type);

            const newDocument: Omit<Document, 'id'> = {
                name: validatedData.name,
                type: selectedOption?.label || validatedData.type,
                category: validatedData.category,
                uploadDate: new Date().toISOString().split('T')[0] || '',
                uploadedBy: 'Current User',
                expiryDate: validatedData.expiryDate || ''
            };

            onUpload(newDocument);
            handleClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0].toString()] = err.message;
                    }
                });
                setFormErrors(errors);
            }
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            type: '',
            category: 'identity',
            expiryDate: '',
            reviewDate: '',
            shareWith: []
        });
        setFormErrors({});
        setSelectedFile(null);
        onClose();
    };

    const handleDateChange = (field: 'expiryDate' | 'reviewDate', range: { from: Date; to: Date; } | undefined) => {
        const dateStr = range?.from ? range.from.toISOString().split('T')[0] : '';
        setFormData(prev => ({
            ...prev,
            [field]: dateStr
        }));
    };


    const shareOptions = [
        { value: 'care_team', label: 'Care Team' },
        { value: 'family', label: 'Family Members' },
        { value: 'doctors', label: 'Doctors' },
        { value: 'nurses', label: 'Nurses' },
        { value: 'social_workers', label: 'Social Workers' },
        { value: 'case_managers', label: 'Case Managers' },
        { value: 'finance_team', label: 'Finance Team' },
        { value: 'legal_team', label: 'Legal Team' }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Upload New Document</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Document File (Required)</Label>
                        <Card
                            className={`border border-dashed p-6 text-center cursor-pointer transition-all ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <div className="space-y-2">
                                    <p className="font-medium text-sm">{selectedFile.name}</p>
                                    <p className="text-sm text-slate-600">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="h-8 w-8 mx-auto text-slate-400" />
                                    <p className="text-sm font-medium">Drop files here or click to browse</p>
                                    <p className="text-sm text-slate-600">
                                        Supports PDF, DOCX, JPG, PNG (Max 10MB)
                                    </p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handleFileSelect(e.target.files[0]);
                                    }
                                }}
                            />
                        </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Document Name */}
                        <div>
                            <Label htmlFor="documentName" className="text-sm font-medium mb-2 block">Document Name (Required)</Label>
                            <CustomInput
                                id="documentName"
                                value={formData.name}
                                onChange={(value) => {
                                    setFormData(prev => ({ ...prev, name: value }));
                                    setFormErrors(prev => {
                                        const { name, ...rest } = prev;
                                        return rest;
                                    });
                                }}
                                placeholder="Enter document name"
                                required
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        {/* Document Type */}
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Document Type (Required)</Label>
                            <CustomSelect
                                options={documentTypes.flatMap(group =>
                                    group.options.map(option => ({
                                        value: option.value,
                                        label: option.label
                                    }))
                                )}
                                value={formData.type}
                                onChange={(value) => {
                                    const selectedOption = documentTypes
                                        .flatMap(group => group.options)
                                        .find(option => option.value === value);
                                    if (selectedOption) {
                                        const category = documentTypes.find(group =>
                                            group.options.some(option => option.value === value)
                                        )?.category as DocumentCategory;
                                        setFormData(prev => ({
                                            ...prev,
                                            type: value,
                                            category: category || 'identity'
                                        }));
                                        setFormErrors(prev => {
                                            const { type, ...rest } = prev;
                                            return rest;
                                        });
                                    }
                                }}
                                placeholder="Select document type"
                            />
                            {formErrors.type && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.type}</p>
                            )}
                        </div>
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="expiryDate" className="text-sm font-medium mb-2 block">Expiry Date (Optional)</Label>
                            <div className="relative" style={{ zIndex: 50 }}>
                                <MyCustomDateRange
                                    onRangeChange={(range) => {
                                        handleDateChange('expiryDate', range);
                                    }}
                                    placeholder="Select expiry date"
                                    oneDate={true}
                                    position="top"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="reviewDate" className="text-sm font-medium mb-2 block">Review Date (Optional)</Label>
                            <div className="relative" style={{ zIndex: 40 }}>
                                <MyCustomDateRange
                                    onRangeChange={(range) => {
                                        handleDateChange('reviewDate', range);
                                    }}
                                    placeholder="Select review date"
                                    oneDate={true}
                                    position="top"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Share With */}
                    <div>
                        <Label htmlFor="shareWith" className="text-sm font-medium mb-2 block">Share With (Optional)</Label>
                        <CustomSelect
                            id="shareWith"
                            options={shareOptions}
                            value={formData.shareWith.join(',')}
                            onChange={(value) => setFormData(prev => ({
                                ...prev,
                                shareWith: value ? value.split(',') : []
                            }))}
                            placeholder="Select who to share with"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Upload Document
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};