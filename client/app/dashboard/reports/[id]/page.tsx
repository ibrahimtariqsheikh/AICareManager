"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Download, FileEdit, Flag, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { useAppSelector } from "@/hooks/useAppSelector"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface BodyMapObservation {
    id: string
    bodyPart: string
    condition: string
}

interface Task {
    id: string
    taskName: string
    completed: boolean
    taskType: string
}

const VisitReportPage = () => {
    const router = useRouter()
    const { agency } = useAppSelector((state: any) => state.agency)
    const [isLoaded, setIsLoaded] = useState(false)
    const [report, setReport] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

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
        lat: report?.checkInLocation?.latitude || 51.507351,
        lng: report?.checkInLocation?.longitude || -0.127758
    };

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        try {
            const bounds = new window.google.maps.LatLngBounds();
            if (report?.checkInLocation) {
                bounds.extend({
                    lat: report.checkInLocation.latitude,
                    lng: report.checkInLocation.longitude
                });
            }
            if (report?.checkOutLocation) {
                bounds.extend({
                    lat: report.checkOutLocation.latitude,
                    lng: report.checkOutLocation.longitude
                });
            }
            map.fitBounds(bounds);
        } catch (error) {
            console.error('Error setting map bounds:', error);
        }
    }, [report]);

    const onUnmount = useCallback(function callback() {
        // Cleanup if needed
    }, []);

    // Format date helper function
    const formatDate = (date: Date, format: string) => {
        const d = new Date(date);

        if (format === "EEEE, d MMM yyyy") {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        if (format === "HH:mm") {
            return d.getHours().toString().padStart(2, '0') + ':' +
                d.getMinutes().toString().padStart(2, '0');
        }

        return d.toLocaleString();
    };

    useEffect(() => {
        // Get the report ID from the URL
        const reportId = window.location.pathname.split('/').pop()

        // Find the report in the agency data
        const foundReport = agency?.reports?.find((r: any) => r.id === reportId)

        if (foundReport) {
            setReport(foundReport)
        }

        setIsLoading(false)
        setIsLoaded(true)
    }, [agency])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!report) {
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

    // Mock medication data
    const medications = [
        { id: "med1", name: "Lisinopril", dosage: "10mg", time: "14:54", taken: true },
        { id: "med2", name: "Ramipril", dosage: "5mg", time: "14:54", taken: true },
        { id: "med3", name: "Zoloft", dosage: "100mg", time: "14:54", taken: false }
    ];

    // Mock task details
    const taskDetails = {
        "FOOD": "Give him a tuna sandwich",
        "DRINKS": "Done",
        "COMPANIONSHIP": "Done",
        "INCIDENT_RESPONSE": "He fell off the stairs"
    };

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
                                    className="h-9 w-9 rounded-full"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="sr-only">Back to reports</span>
                                </Button>
                            </Link>
                            <h1 className="text-lg font-semibold text-gray-900">{report.client?.fullName}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 rounded-xl px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <div className={`flex items-center text-xs ${getStatusColor(report.status)} rounded-md px-2 py-1 font-medium`}>
                                {getStatusIcon(report.status)}
                                <div className="text-xs">{report.status}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-base font-medium mb-3">Visit details</h2>
                        <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600">Visit type:</p>
                                    <p className="text-sm font-medium">{report.visitType?.name || 'Standard Visit'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Client:</p>
                                    <p className="text-sm font-medium">{report.client?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Care worker:</p>
                                    <p className="text-sm font-medium">{report.caregiver?.fullName}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <p className="text-xs text-gray-600">Check in date:</p>
                                    <p className="text-sm font-medium">{formatDate(report.checkInTime, "EEEE, d MMM yyyy")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Check in time:</p>
                                    <p className="text-sm font-medium flex items-center">
                                        {formatDate(report.checkInTime, "HH:mm")}
                                        <span className="text-xs text-gray-500 ml-2">({report.checkInDistance} meters from client's home)</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Duration:</p>
                                    <p className="text-sm font-medium">2m</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <p className="text-xs text-gray-600">Check out date:</p>
                                    <p className="text-sm font-medium">{formatDate(report.checkOutTime, "EEEE, d MMM yyyy")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Check out time:</p>
                                    <p className="text-sm font-medium flex items-center">
                                        {formatDate(report.checkOutTime, "HH:mm")}
                                        <span className="text-xs text-gray-500 ml-2">({report.checkOutDistance} meters from client's home)</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Client seemed:</p>
                                    <p className="text-sm font-medium">Happy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {report.alerts && report.alerts.length > 0 && (
                        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                            <div className="flex items-start">
                                <div className="mr-4">
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-red-800 mb-1">An alert was raised</h3>
                                    <p className="text-sm text-red-700">{report.alerts[0]?.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center mb-1">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                    <CardTitle className="text-sm">Medication</CardTitle>
                                </div>
                                <CardDescription className="text-xs">Lunchtime medications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {medications.map(med => (
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
                                                    <p className="text-xs font-medium">{med.name} - {med.time}</p>
                                                    <span className={med.taken ? "text-green-600 text-xs" : "text-red-600 text-xs"}>
                                                        {med.taken ? "Taken" : "Not taken"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600">1 x {med.dosage} tablet</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                                        <path d="M12 13V9" />
                                        <path d="M11 17h2" />
                                    </svg>
                                    <CardTitle className="text-sm">Check-in and check-out locations</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full h-56 bg-gray-100 rounded-b-lg overflow-hidden">
                                    {loadError ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                                <p className="text-sm text-red-600">Failed to load map</p>
                                            </div>
                                        </div>
                                    ) : isMapLoaded ? (
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
                                                zoomControl: true
                                            }}
                                        >
                                            {report?.checkInLocation && (
                                                <Marker
                                                    position={{
                                                        lat: report.checkInLocation.latitude,
                                                        lng: report.checkInLocation.longitude
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
                                            {report?.checkOutLocation && (
                                                <Marker
                                                    position={{
                                                        lat: report.checkOutLocation.latitude,
                                                        lng: report.checkOutLocation.longitude
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
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                                <p className="text-sm text-gray-600">Loading map...</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4">
                                        <div className="bg-white rounded-full p-2 shadow-md">
                                            <Home className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                    <path d="M18 14h-8" />
                                    <path d="M15 18h-5" />
                                    <path d="M10 6h8v4h-8V6Z" />
                                </svg>
                                <CardTitle className="text-sm">Body map</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center space-x-8">
                                <div className="text-center">
                                    <div className="mb-4">
                                        <Image
                                            src="/assets/body_map_front.svg"
                                            alt="Front view of human body"
                                            width={140}
                                            height={300}
                                            className="mx-auto"
                                        />
                                        <p className="text-xs font-medium mt-2">Front view</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="mb-4">
                                        <Image
                                            src="/assets/body_map_back.svg"
                                            alt="Back view of human body"
                                            width={140}
                                            height={300}
                                            className="mx-auto"
                                        />
                                        <p className="text-xs font-medium mt-2">Back view</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                {report.bodyMapObservations?.map((observation: BodyMapObservation) => (
                                    <div key={observation.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-800">
                                            <span className="font-medium">{observation.bodyPart}:</span> {observation.condition}
                                        </p>
                                    </div>
                                ))}
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-700">
                                        <span className="font-medium">General note:</span> Looking good overall
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Completed Tasks Card */}
                        <div className="space-y-3">
                            {report.tasksCompleted?.filter((task: Task) => task.taskType === "FOOD" || task.taskType === "DRINKS")
                                .map((task: Task) => (
                                    <Card key={task.id}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center">
                                                {task.taskType === "FOOD" ? (
                                                    <svg className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M16 2H8v7h8V2Z" />
                                                        <path d="M12 17v4" />
                                                        <path d="M2 9h20v3a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V9Z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                                                        <path d="M12 8v1" />
                                                        <path d="M12 15v1" />
                                                        <path d="M16 12h-1" />
                                                        <path d="M9 12H8" />
                                                        <path d="M14.9 9.2l-.7.7" />
                                                        <path d="M9.8 14.9l-.7.7" />
                                                        <path d="M14.9 14.9l-.7-.7" />
                                                        <path d="M9.8 9.2l-.7-.7" />
                                                        <path d="M20 4v5l-1.5.5" />
                                                        <path d="M4 5v4l1.5.5" />
                                                        <path d="M19 12.5V19l-7 3-7-3v-6.5" />
                                                    </svg>
                                                )}
                                                <CardTitle className="text-sm">{task.taskName}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xs text-gray-700">{taskDetails[task.taskType as keyof typeof taskDetails]}</p>
                                        </CardContent>
                                    </Card>
                                ))}

                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                                            <path d="M12 13V9" />
                                            <path d="M11 17h2" />
                                        </svg>
                                        <CardTitle className="text-sm">Incident response</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-700">{taskDetails["INCIDENT_RESPONSE"]}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 6.1H3v10h14v-10Z" />
                                            <path d="m21 16-4-2V8l4-2v10Z" />
                                            <path d="M3 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
                                            <path d="M10 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                                        </svg>
                                        <CardTitle className="text-sm">Companionship / respite care</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-700">{taskDetails["COMPANIONSHIP"]}</p>
                                </CardContent>
                            </Card>

                            {report.summary && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M8 10h8" />
                                                <path d="M8 14h4" />
                                                <path d="M12 3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
                                                <path d="M12 3v6h6" />
                                            </svg>
                                            <CardTitle className="text-sm">Summary</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-gray-700 leading-relaxed">{report.summary}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitReportPage;