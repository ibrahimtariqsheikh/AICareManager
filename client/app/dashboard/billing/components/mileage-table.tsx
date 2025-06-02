import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MapPin,
    Clock,
    Route,
    Edit,
    Eye,
    Trash2,
    MoreHorizontal,
    ArrowUpDown,
    Download,
    Plus,
    Search
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CustomInput } from '@/components/ui/custom-input';
import { CustomSelect } from '@/components/ui/custom-select';
import { MyCustomDateRange } from '@/app/dashboard/billing/components/my-custom-date-range';
import { getRandomPlaceholderImage } from '@/lib/utils';

const MileageTable = () => {
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Sample mileage data
    const mileageEntries = [
        {
            id: 'ML-001',
            date: '2025-06-01',
            employee: {
                name: 'John Smith',
                avatar: '/placeholder.svg?height=32&width=32'
            },
            client: 'Maria Garcia',
            fromAddress: '123 Main St, Toronto, ON',
            toAddress: '456 Oak Ave, Mississauga, ON',
            distance: 12.5,
            travelTime: 25,
            rate: 0.67,
            amount: 8.38,
            status: 'approved',
            appointmentType: 'Home Visit'
        },
        {
            id: 'ML-002',
            date: '2025-06-01',
            employee: {
                name: 'Sarah Johnson',
                avatar: '/placeholder.svg?height=32&width=32'
            },
            client: 'Robert Chen',
            fromAddress: '789 Pine St, Toronto, ON',
            toAddress: '321 Elm Dr, Brampton, ON',
            distance: 18.2,
            travelTime: 32,
            rate: 0.67,
            amount: 12.19,
            status: 'pending',
            appointmentType: 'Weekly Checkup'
        },
        {
            id: 'ML-003',
            date: '2025-05-31',
            employee: {
                name: 'Mike Wilson',
                avatar: '/placeholder.svg?height=32&width=32'
            },
            client: 'Linda Thompson',
            fromAddress: '555 Queen St, Toronto, ON',
            toAddress: '888 King St, Scarborough, ON',
            distance: 24.7,
            travelTime: 45,
            rate: 0.67,
            amount: 16.55,
            status: 'approved',
            appointmentType: 'Emergency'
        },
        {
            id: 'ML-004',
            date: '2025-05-31',
            employee: {
                name: 'Emily Davis',
                avatar: '/placeholder.svg?height=32&width=32'
            },
            client: 'James Miller',
            fromAddress: '234 Bay St, Toronto, ON',
            toAddress: '567 College St, Toronto, ON',
            distance: 3.8,
            travelTime: 12,
            rate: 0.67,
            amount: 2.55,
            status: 'rejected',
            appointmentType: 'Routine'
        }
    ];

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'approved', label: 'Approved' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' }
    ];

    // Filter entries based on search query, status, and date range
    const filteredEntries = mileageEntries.filter(entry => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            entry.id.toLowerCase().includes(searchLower) ||
            entry.employee.name.toLowerCase().includes(searchLower) ||
            entry.client.toLowerCase().includes(searchLower) ||
            entry.fromAddress.toLowerCase().includes(searchLower) ||
            entry.toAddress.toLowerCase().includes(searchLower) ||
            entry.appointmentType.toLowerCase().includes(searchLower);

        // Status filter
        const matchesStatus = !statusFilter || entry.status === statusFilter;

        // Date range filter
        const entryDate = new Date(entry.date);
        const matchesDateRange = !dateRange || (
            entryDate >= dateRange.from &&
            entryDate <= dateRange.to
        );

        return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort entries
    const sortedEntries = [...filteredEntries].sort((a, b) => {
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        }

        return 0;
    });

    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };



    return (
        <div className="space-y-4">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CustomInput
                        placeholder="Search mileage entries..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        icon={<Search className="h-4 w-4" />}
                        inputSize="sm"
                        className="w-[400px]"
                    />
                    <CustomSelect
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="Filter by status"
                        selectSize="sm"
                        className="w-[150px]"
                    />
                    <MyCustomDateRange
                        onRangeChange={setDateRange}
                        initialDateRange={dateRange}
                        placeholder="Date range"
                        className="w-[200px]"
                    />
                </div>
            </div>

            {/* Mileage Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border bg-muted/50">
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('date')}>
                                <div className="flex items-center">
                                    Date
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('employee')}>
                                <div className="flex items-center">
                                    Employee
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('client')}>
                                <div className="flex items-center">
                                    Client & Route
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('distance')}>
                                <div className="flex items-center">
                                    Distance
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('travelTime')}>
                                <div className="flex items-center">
                                    Travel Time
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('amount')}>
                                <div className="flex items-center">
                                    Amount
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort('status')}>
                                <div className="flex items-center">
                                    Status
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="w-12 py-2 px-3"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedEntries.map((entry) => (
                            <TableRow key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                <TableCell className="py-2 px-3">
                                    <div className="font-medium">
                                        {new Date(entry.date).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={getRandomPlaceholderImage()}
                                                alt={entry.employee.name}
                                            />
                                            <AvatarFallback>{entry.employee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{entry.employee.name}</div>
                                            <div className="text-sm text-muted-foreground">{entry.appointmentType}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <div className="space-y-1">
                                        <div className="font-medium flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-blue-500" />
                                            {entry.client}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span className="text-green-600">From:</span>
                                                <span>{entry.fromAddress}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="text-red-600">To:</span>
                                                <span>{entry.toAddress}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <div className="flex items-center gap-1">
                                        <Route className="h-4 w-4 text-blue-500" />
                                        <span className="font-medium">{entry.distance} mi</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        ${entry.rate}/mile
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <span className="font-medium">{entry.travelTime} min</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3 font-medium">
                                    ${entry.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <Badge variant="outline" className={getStatusColor(entry.status)}>
                                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                <Trash2 className="h-4 w-4" /> Delete Entry
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MileageTable; 