"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Download, FileEdit, Flag, Home, AlertTriangle, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { useAppSelector } from "@/hooks/useAppSelector"
import Link from "next/link"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useGetReportByIdQuery, useResolveReportAlertMutation } from '@/state/api';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface BodyMapObservation {
    id: string
    bodyPart: string
    condition: string
    position: {
        top: string
        left: string
        width: string
        height: string
    }
}

interface Task {
    id: string
    taskName: string
    completed: boolean
    taskType: string
    notes?: string
    completedAt?: string
}

interface Alert {
    id: string
    type: string
    description: string
    status: string
    severity: 'high' | 'medium' | 'low'
    time: string
    actionTaken: string
    icon: any
}

interface Location {
    latitude: number
    longitude: number
}

interface VisitType {
    id: string;
    name: string;
    description: string | null;
    visitTypeName?: string; // Adding this for backward compatibility
}

interface MedicationSnapshot {
    id: string;
    name: string;
    taken: boolean;
    scheduledTime: string;
    dosage?: string;
    notes?: string;
}

interface Report {
    id: string
    clientId: string
    agencyId: string
    userId: string
    visitTypeId: string | null
    title: string | null
    condition: string
    summary: string
    checkInTime: string
    checkOutTime: string | null
    createdAt: string
    checkInDistance: number | null
    checkOutDistance: number | null
    checkInLocation: string | null
    checkOutLocation: string | null
    signatureImageUrl: string | null
    status: string
    lastEditedAt: string | null
    lastEditedBy: string | null
    lastEditReason: string | null
    client: any
    caregiver: any
    agency: any
    visitType: VisitType | null
    tasksCompleted: any[]
    alerts: any[]
    bodyMapObservations: any[]
    editHistory: any[]
    visitSnapshot: any | null
    medicationSnapshot: MedicationSnapshot[]
}

const parseLocation = (locationString: string | undefined | null): Location | null => {
    if (!locationString) return null;
    try {
        const parts = locationString.split(',');
        if (parts.length !== 2) return null;

        const lat = Number(parts[0]);
        const lng = Number(parts[1]);

        if (isNaN(lat) || isNaN(lng)) return null;
        return { latitude: lat, longitude: lng };
    } catch (error) {
        console.error('Error parsing location:', error);
        return null;
    }
};

const VisitReportPage = () => {
    const { agency } = useAppSelector((state: any) => state.agency)
    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
    const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false)
    const [newResolution, setNewResolution] = useState("")
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const params = useParams();
    const reportId = params.id as string;
    const user = useAppSelector((state: any) => state.user.user.userInfo)

    const [resolveReportAlert, { isLoading: isResolvingAlert }] = useResolveReportAlertMutation()

    console.log("Component rendered with reportId:", reportId);

    const { data: reportFromApi, isLoading: isReportLoading, isError: isReportError } = useGetReportByIdQuery(reportId) as {
        data: Report | undefined,
        isLoading: boolean,
        isError: boolean
    };

    console.log("Query state:", { reportFromApi, isReportLoading, isReportError });

    const { isLoaded: isMapLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places']
    });

    useEffect(() => {
        if (loadError) {
            console.error('Error loading Google Maps:', loadError);
        }
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
            console.error('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file');
        }
    }, [loadError]);

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };

    const center = {
        lat: parseLocation(reportFromApi?.checkInLocation)?.latitude || 51.507351,
        lng: parseLocation(reportFromApi?.checkInLocation)?.longitude || -0.127758
    };

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        try {
            setMap(map);
            const bounds = new window.google.maps.LatLngBounds();
            const checkInLoc = parseLocation(reportFromApi?.checkInLocation);
            const checkOutLoc = parseLocation(reportFromApi?.checkOutLocation);

            if (checkInLoc) {
                bounds.extend({
                    lat: checkInLoc.latitude,
                    lng: checkInLoc.longitude
                });
            }
            if (checkOutLoc) {
                bounds.extend({
                    lat: checkOutLoc.latitude,
                    lng: checkOutLoc.longitude
                });
            }
            map.fitBounds(bounds);
        } catch (error) {
            console.error('Error setting map bounds:', error);
        }
    }, [reportFromApi]);

    const onUnmount = useCallback(function callback() {
        // Cleanup if needed
    }, []);

    const centerOnHome = useCallback(() => {
        const checkInLoc = parseLocation(reportFromApi?.checkInLocation);
        if (map && checkInLoc) {
            map.panTo({
                lat: checkInLoc.latitude,
                lng: checkInLoc.longitude
            });
            map.setZoom(15);
        }
    }, [map, reportFromApi]);

    const zoomIn = useCallback(() => {
        if (map) {
            map.setZoom(map.getZoom()! + 1);
        }
    }, [map]);

    const zoomOut = useCallback(() => {
        if (map) {
            map.setZoom(map.getZoom()! - 1);
        }
    }, [map]);

    // Update formatDate to handle Date objects
    const formatDate = (dateString: string | Date | null | undefined, format: string) => {
        if (!dateString) return 'Not available';

        const d = new Date(dateString);

        // Check for invalid dates (like the 1970 timestamp in your data)
        if (d.getFullYear() === 1970 || isNaN(d.getTime())) {
            return 'Not available';
        }

        if (format === "EEEE, d MMM yyyy") {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        if (format === "HH:mm") {
            const hours = d.getHours();
            const minutes = d.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
            return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        }

        if (format === "d MMM yyyy") {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        return d.toLocaleString();
    };

    // Calculate visit duration
    const calculateDuration = () => {
        if (!reportFromApi?.checkInTime || !reportFromApi?.checkOutTime) {
            return 'Not available';
        }

        const checkIn = new Date(reportFromApi.checkInTime);
        const checkOut = new Date(reportFromApi.checkOutTime);

        if (checkIn.getFullYear() === 1970 || checkOut.getFullYear() === 1970) {
            return 'Not available';
        }

        const diffMs = checkOut.getTime() - checkIn.getTime();
        const diffMins = Math.round(diffMs / (1000 * 60));

        if (diffMins < 60) {
            return `${diffMins}m`;
        } else {
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;
            return `${hours}h ${minutes}m`;
        }
    };

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const handleAddResolution = async () => {
        if (selectedAlert && newResolution.trim() && user?.id) {
            try {
                await resolveReportAlert({
                    alertId: selectedAlert.id,
                    description: newResolution,
                    resolvedById: user.id
                }).unwrap();

                setNewResolution("");
                setSelectedAlert(null);
                setResolutionDialogOpen(false);
                toast.success("Resolution added successfully");
            } catch (error) {
                console.error("Error adding resolution:", error);
                toast.error("Error adding resolution");
            }
        }
    };

    const handleAlertClick = (alert: Alert) => {
        if (alert.actionTaken) {
            setSelectedAlert(alert);
        }
    };

    const handleAddResolutionClick = (alert: Alert, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedAlert(alert);
        setResolutionDialogOpen(true);
    };

    // Map API alert types to display names and icons
    const getAlertInfo = (type: string) => {
        switch (type) {
            case 'MEDICATION':
                return { displayName: 'Medication Alert', icon: Heart, severity: 'high' as const };
            case 'LOCATION':
                return { displayName: 'Location Alert', icon: MapPin, severity: 'medium' as const };
            case 'LATE_VISIT':
                return { displayName: 'Late Visit', icon: Clock, severity: 'medium' as const };
            default:
                return { displayName: type, icon: AlertTriangle, severity: 'low' as const };
        }
    };

    // Transform API alerts to component format
    const transformedAlerts: Alert[] = reportFromApi?.alerts?.map((alert: any) => {
        const alertInfo = getAlertInfo(alert.type);
        const alertTime = alert.resolvedAt ? new Date(alert.resolvedAt) : new Date(alert.createdAt);

        return {
            id: alert.id,
            type: alertInfo.displayName,
            description: alert.description,
            status: alert.status,
            severity: alertInfo.severity,
            time: alertTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionTaken: alert.status === 'RESOLVED' ? `Resolved by admin on ${formatDate(alert.resolvedAt, "d MMM yyyy")}` : '',
            resolvedAt: alert.resolvedAt,
            icon: alertInfo.icon
        };
    }) || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-600/20 text-green-900 border border-green-400/20";
            case "DRAFT":
                return "bg-yellow-600/20 text-yellow-900 border border-yellow-400/20";
            case "EDITED":
                return "bg-blue-600/20 text-blue-900 border border-blue-400/20";
            case "FLAGGED":
                return "bg-red-600/20 text-red-900 border border-red-400/20";
            case "REVIEWED":
                return "bg-cyan-600/20 text-cyan-900 border border-cyan-400/20";
            default:
                return "bg-gray-600/20 text-gray-900 border border-gray-400/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
            case "DRAFT":
                return <Clock className="h-3.5 w-3.5 mr-1" />;
            case "EDITED":
                return <FileEdit className="h-3.5 w-3.5 mr-1" />;
            case "FLAGGED":
                return <Flag className="h-3.5 w-3.5 mr-1" />;
            case "REVIEWED":
                return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
            default:
                return null;
        }
    };

    if (isReportLoading) {
        return (
            <div className="p-6 space-y-4 mt-3">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Visit Details Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center mb-3">
                                <Skeleton className="h-5 w-5 mr-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center">
                                <Skeleton className="h-5 w-5 mr-2" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Skeleton className="h-56 w-full" />
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts Section */}
                <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex items-center">
                            <Skeleton className="h-5 w-5 mr-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="p-3 rounded-lg border">
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-48" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks and Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Tasks Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center">
                                <Skeleton className="h-5 w-5 mr-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Skeleton className="h-5 w-5 mt-0.5" />
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-4 w-48" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center">
                                <Skeleton className="h-5 w-5 mr-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (isReportError || !reportFromApi) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Report not found</h2>
                    <p className="text-gray-600 mb-4">The report you're looking for doesn't exist or has been removed.</p>
                    <Link href="/dashboard/reports">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Reports
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Body map observations from API data
    const bodyMapObservations: BodyMapObservation[] = reportFromApi?.bodyMapObservations?.map((obs: any) => ({
        id: obs.id,
        bodyPart: obs.bodyPart,
        condition: obs.condition,
        position: obs.position
    })) || [];

    return (
        <div className={`relative min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            <div className="container mx-auto px-10 py-6">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/reports">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-md"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="sr-only">Back to reports</span>
                                </Button>
                            </Link>
                            <h1 className="text-lg font-semibold text-gray-900">
                                {reportFromApi.client?.fullName || 'Unknown Client'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 rounded-md px-4 py-2 border border-gray-300 bg-white text-neutral-900 hover:bg-gray-50 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <div className={`flex items-center text-xs ${getStatusColor(reportFromApi.status)} rounded-md px-2 py-1 font-medium`}>
                                {getStatusIcon(reportFromApi.status)}
                                <div className="text-xs">{reportFromApi.status}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-3">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                <h2 className="text-base font-medium">Visit details</h2>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600">Visit type</p>
                                    <p className="text-sm font-medium">{reportFromApi.visitType?.visitTypeName || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Client</p>
                                    <p className="text-sm font-medium">{reportFromApi.client?.fullName || 'Not available'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Care worker</p>
                                    <p className="text-sm font-medium">{reportFromApi.caregiver?.fullName || 'Not available'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Duration</p>
                                    <p className="text-sm font-medium">{calculateDuration()}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-xs text-gray-600">Check in:</p>
                                        <p className="text-sm font-medium">{formatDate(reportFromApi.checkInTime, "HH:mm")}</p>
                                        <p className="text-xs text-gray-500">{formatDate(reportFromApi.checkInTime, "d MMM yyyy")}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Check out:</p>
                                        <p className="text-sm font-medium">{formatDate(reportFromApi.checkOutTime, "HH:mm")}</p>
                                        <p className="text-xs text-gray-500">{formatDate(reportFromApi.checkOutTime, "d MMM yyyy")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                                        <path d="M12 13V9" />
                                        <path d="M11 17h2" />
                                    </svg>
                                    <CardTitle className="text-sm">Check-in and check-out details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full h-56 bg-gray-100 rounded-b-lg overflow-hidden">
                                    {(!reportFromApi.checkInLocation && !reportFromApi.checkOutLocation) ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">No location data available</p>
                                            </div>
                                        </div>
                                    ) : loadError ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                                <p className="text-sm text-red-600">Failed to load map</p>
                                            </div>
                                        </div>
                                    ) : isMapLoaded ? (
                                        <div className="w-full h-full p-2 rounded-lg">
                                            <GoogleMap
                                                mapContainerStyle={mapContainerStyle}
                                                center={center}
                                                zoom={13}
                                                onLoad={onLoad}
                                                onUnmount={onUnmount}
                                                options={{
                                                    styles: [
                                                        {
                                                            featureType: "poi",
                                                            elementType: "labels",
                                                            stylers: [{ visibility: "off" }]
                                                        }
                                                    ],
                                                    disableDefaultUI: true,
                                                    zoomControl: false
                                                }}
                                            >
                                                {reportFromApi?.checkInLocation && (
                                                    <Marker
                                                        position={{
                                                            lat: parseLocation(reportFromApi.checkInLocation)?.latitude || 0,
                                                            lng: parseLocation(reportFromApi.checkInLocation)?.longitude || 0
                                                        }}
                                                        icon={{
                                                            path: google.maps.SymbolPath.CIRCLE,
                                                            scale: 8,
                                                            fillColor: "#4F46E5",
                                                            fillOpacity: 1,
                                                            strokeColor: "#ffffff",
                                                            strokeWeight: 2,
                                                        }}
                                                    />
                                                )}
                                                {reportFromApi?.checkOutLocation && (
                                                    <Marker
                                                        position={{
                                                            lat: parseLocation(reportFromApi.checkOutLocation)?.latitude || 0,
                                                            lng: parseLocation(reportFromApi.checkOutLocation)?.longitude || 0
                                                        }}
                                                        icon={{
                                                            path: google.maps.SymbolPath.CIRCLE,
                                                            scale: 8,
                                                            fillColor: "#10B981",
                                                            fillOpacity: 1,
                                                            strokeColor: "#ffffff",
                                                            strokeWeight: 2,
                                                        }}
                                                    />
                                                )}
                                            </GoogleMap>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                                <p className="text-sm text-gray-600">Loading map...</p>
                                            </div>
                                        </div>
                                    )}
                                    {(reportFromApi.checkInLocation || reportFromApi.checkOutLocation) && (
                                        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                                            <button
                                                onClick={centerOnHome}
                                                className="bg-white rounded-full p-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <Home className="h-4 w-4 text-blue-600" />
                                            </button>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={zoomIn}
                                                    className="bg-white rounded-full p-2 hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 5v14M5 12h14" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={zoomOut}
                                                    className="bg-white rounded-full p-2 hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M5 12h14" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                                <p className="text-xs font-medium">Check-in</p>
                                            </div>
                                            <div className="pl-5 space-y-1">
                                                <p className="text-xs text-gray-600">Time:</p>
                                                <p className="text-sm font-medium">{formatDate(reportFromApi.checkInTime, "HH:mm")}</p>
                                                <p className="text-xs text-gray-500">
                                                    {reportFromApi.checkInDistance ? `${reportFromApi.checkInDistance} meters from client's home` : 'Distance not recorded'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                                                <p className="text-xs font-medium">Check-out</p>
                                            </div>
                                            <div className="pl-5 space-y-1">
                                                <p className="text-xs text-gray-600">Time:</p>
                                                <p className="text-sm font-medium">{formatDate(reportFromApi.checkOutTime, "HH:mm")}</p>
                                                <p className="text-xs text-gray-500">
                                                    {reportFromApi.checkOutDistance ? `${reportFromApi.checkOutDistance} meters from client's home` : 'Distance not recorded'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alerts Section */}
                    {transformedAlerts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Alerts ({transformedAlerts.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3">
                                    {transformedAlerts
                                        .sort((a, b) => {
                                            // Sort by resolution status first (unresolved first)
                                            if (!a.actionTaken && b.actionTaken) return -1;
                                            if (a.actionTaken && !b.actionTaken) return 1;
                                            return 0;
                                        })
                                        .map(alert => (
                                            <div
                                                key={alert.id}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${alert.severity === 'high' ? 'bg-red-50/80 border-red-200 hover:bg-red-100/80' :
                                                    alert.severity === 'medium' ? 'bg-amber-50/80 border-amber-200 hover:bg-amber-100/80' :
                                                        'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80'
                                                    }`}
                                                onClick={() => handleAlertClick(alert)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-full ${alert.severity === 'high' ? 'bg-red-200' :
                                                        alert.severity === 'medium' ? 'bg-amber-200' :
                                                            'bg-blue-200'
                                                        }`}>
                                                        <alert.icon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium text-sm truncate">{alert.type}</h4>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-600 whitespace-nowrap">{alert.time}</span>
                                                                <Badge variant={alert.status === 'RESOLVED' ? 'default' : 'destructive'} className="text-xs">
                                                                    {alert.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-700 mb-2 line-clamp-2">{alert.description}</p>
                                                        <div className="bg-white/50 rounded px-2 py-1 border border-white/60">
                                                            <p className="text-xs">
                                                                {alert.actionTaken ? (
                                                                    <>
                                                                        <span className="text-gray-600">Resolution:</span> {alert.actionTaken}
                                                                    </>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className={`text-xs flex items-center gap-1.5 px-2 py-1 h-auto border rounded-md transition-all duration-200 ${alert.severity === 'high'
                                                                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50/50 border-red-200/50 hover:border-red-300/50'
                                                                            : alert.severity === 'medium'
                                                                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50/50 border-amber-200/50 hover:border-amber-300/50'
                                                                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 border-blue-200/50 hover:border-blue-300/50'
                                                                            }`}
                                                                        onClick={(e) => handleAddResolutionClick(alert, e)}
                                                                    >
                                                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M12 5v14M5 12h14" />
                                                                        </svg>
                                                                        Add Resolution
                                                                    </Button>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Medication Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center mb-1">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                    <CardTitle className="text-sm">Medication</CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    {reportFromApi?.medicationSnapshot?.length ? 'Medication administration record' : 'No medications administered'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {reportFromApi?.medicationSnapshot?.length ? (
                                    <div className="space-y-3">
                                        {reportFromApi.medicationSnapshot.map((med) => (
                                            <div key={med.id} className="flex items-start">
                                                {med.taken ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center mr-3 mt-0.5">
                                                        <span className="text-red-500 font-bold text-xs">✕</span>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <p className="text-xs font-medium">{med.name || 'Medication'} - {formatDate(med.scheduledTime, "HH:mm")}</p>
                                                        <span className={med.taken ? "text-green-600 text-xs" : "text-red-600 text-xs"}>
                                                            {med.taken ? "Taken" : "Not taken"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600">{med.dosage || 'Dosage not specified'}</p>
                                                    {med.notes && <p className="text-xs text-gray-500 mt-1">{med.notes}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No medications recorded for this visit</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Body Map Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                        <path d="M18 14h-8" />
                                        <path d="M15 18h-5" />
                                        <path d="M10 6h8v4h-8V6Z" />
                                    </svg>
                                    <CardTitle className="text-sm">Body map</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {bodyMapObservations.length > 0 ? (
                                    <>
                                        <div className="flex justify-center space-x-8">
                                            <div className="text-center relative">
                                                <div className="mb-4 relative">
                                                    <Image
                                                        src="/assets/body_map_front.svg"
                                                        alt="Front view of human body"
                                                        width={140}
                                                        height={300}
                                                        className="mx-auto"
                                                    />
                                                    {bodyMapObservations.filter((obs: BodyMapObservation) => obs.bodyPart.includes('front')).map((observation: BodyMapObservation) => (
                                                        <div
                                                            key={observation.id}
                                                            className="absolute bg-blue-500/30 border-2 border-blue-500/50 rounded-md transition-all duration-200 hover:bg-blue-500/40"
                                                            style={{
                                                                top: observation.position.top,
                                                                left: observation.position.left,
                                                                width: observation.position.width,
                                                                height: observation.position.height
                                                            }}
                                                        />
                                                    ))}
                                                    <p className="text-xs font-medium mt-2">Front view</p>
                                                </div>
                                            </div>

                                            <div className="text-center relative">
                                                <div className="mb-4 relative">
                                                    <Image
                                                        src="/assets/body_map_back.svg"
                                                        alt="Back view of human body"
                                                        width={140}
                                                        height={300}
                                                        className="mx-auto"
                                                        loading="lazy"
                                                    />
                                                    {bodyMapObservations.filter((obs: BodyMapObservation) => obs.bodyPart.includes('back')).map((observation: BodyMapObservation) => (
                                                        <div
                                                            key={observation.id}
                                                            className="absolute bg-blue-500/30 border-2 border-blue-500/50 rounded-md transition-all duration-200 hover:bg-blue-500/40"
                                                            style={{
                                                                top: observation.position.top,
                                                                left: observation.position.left,
                                                                width: observation.position.width,
                                                                height: observation.position.height
                                                            }}
                                                        />
                                                    ))}
                                                    <p className="text-xs font-medium mt-2">Back view</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {bodyMapObservations.map((observation: BodyMapObservation) => (
                                                <div key={observation.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p className="text-xs text-blue-800">
                                                        <span className="font-medium">{observation.bodyPart.split('-').map(word =>
                                                            word.charAt(0).toUpperCase() + word.slice(1)
                                                        ).join(' ')}:</span> {observation.condition}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg viewBox="0 0 24 24" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1">
                                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                                            <path d="M12 6v6l4 2" />
                                        </svg>
                                        <p className="text-sm text-gray-500">No body map observations recorded</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tasks Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Tasks Completed ({reportFromApi.tasksCompleted?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reportFromApi.tasksCompleted?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {reportFromApi.tasksCompleted.map((task: any) => (
                                        <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-medium truncate">{task.taskName || task.taskType}</h4>
                                                    {task.completedAt && (
                                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                            {formatDate(task.completedAt, "HH:mm")}
                                                        </span>
                                                    )}
                                                </div>
                                                {task.notes && (
                                                    <p className="text-xs text-gray-600 line-clamp-2">{task.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">No tasks recorded for this visit</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Visit Summary */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Flag className="h-4 w-4 text-blue-500" />
                                Visit Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600 font-medium mb-1">Condition:</p>
                                    <p className="text-sm text-gray-700">{reportFromApi.condition || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium mb-1">Summary:</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {reportFromApi.summary || 'No summary provided for this visit.'}
                                    </p>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Resolution Dialog */}
            <Dialog open={resolutionDialogOpen} onOpenChange={setResolutionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Resolution</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter resolution details..."
                            value={newResolution}
                            onChange={(e) => setNewResolution(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setResolutionDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddResolution}
                            disabled={!newResolution.trim()}
                        >
                            Save Resolution
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Alert Detail Modal */}
            {selectedAlert && selectedAlert.actionTaken && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{selectedAlert.type}</span>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)} className="h-8 w-8 p-0">
                                    <span className="text-lg">×</span>
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium">Time:</p>
                                    <p className="text-sm text-gray-600">{selectedAlert.time}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Description:</p>
                                    <p className="text-sm text-gray-600">{selectedAlert.description}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Action Taken:</p>
                                    <p className="text-sm text-gray-600">{selectedAlert.actionTaken}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <Badge className={
                                        selectedAlert.status === 'RESOLVED' ? 'bg-green-100 text-green-800 border-green-200' :
                                            'bg-red-100 text-red-800 border-red-200'
                                    }>
                                        {selectedAlert.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Severity:</p>
                                    <Badge className={
                                        selectedAlert.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                                            selectedAlert.severity === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                'bg-blue-100 text-blue-800 border-blue-200'
                                    }>
                                        {selectedAlert.severity.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default VisitReportPage;