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
    severity: 'high' | 'medium' | 'low'
    time: string
    description: string
    actionTaken: string
    icon: any
}

const VisitReportPage = () => {
    const { agency } = useAppSelector((state: any) => state.agency)
    const [isLoaded, setIsLoaded] = useState(false)
    const [report, setReport] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
    const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false)
    const [newResolution, setNewResolution] = useState("")
    const [map, setMap] = useState<google.maps.Map | null>(null);

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
            setMap(map);
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

    const centerOnHome = useCallback(() => {
        if (map && report?.checkInLocation) {
            map.panTo({
                lat: report.checkInLocation.latitude,
                lng: report.checkInLocation.longitude
            });
            map.setZoom(15);
        }
    }, [map, report]);

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

    const handleAddResolution = () => {
        if (selectedAlert && newResolution.trim()) {
            // Here you would typically update the alert in your backend
            const updatedAlert = {
                ...selectedAlert,
                actionTaken: newResolution
            };
            setSelectedAlert(updatedAlert);
            setNewResolution("");
            setResolutionDialogOpen(false);
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

    // Mock data for tasks
    const mockTasks: Task[] = [
        { id: "1", taskName: "Food preparation", completed: true, taskType: "FOOD", notes: "Prepared tuna sandwich as requested", completedAt: "2024-01-01T14:30:00Z" },
        { id: "2", taskName: "Drinks", completed: true, taskType: "DRINKS", notes: "Provided water and tea", completedAt: "2024-01-01T14:35:00Z" },
        { id: "3", taskName: "Companionship", completed: true, taskType: "COMPANIONSHIP", notes: "Engaged in conversation about family", completedAt: "2024-01-01T14:40:00Z" },
        { id: "4", taskName: "Personal care", completed: true, taskType: "PERSONALCARE", notes: "Assisted with hygiene needs", completedAt: "2024-01-01T14:45:00Z" }
    ];

    // Mock data for alerts
    const mockAlerts: Alert[] = [
        {
            id: "1",
            type: "Fall Incident",
            severity: "high",
            time: "14:30",
            description: "Client experienced a minor fall in the bathroom. No injuries sustained. Assessed and documented.",
            actionTaken: "Helped client to safety, checked for injuries, reported to family",
            icon: AlertTriangle
        },
        {
            id: "2",
            type: "Blood Pressure",
            severity: "medium",
            time: "14:45",
            description: "Blood pressure reading slightly elevated (150/90)",
            actionTaken: "",
            icon: Heart
        },
        {
            id: "3",
            type: "Distance Alert",
            severity: "low",
            time: "14:00",
            description: "Check-in location 8 meters from designated area",
            actionTaken: "Verified correct location with client",
            icon: MapPin
        }
    ];

    const bodyMapObservations: BodyMapObservation[] = [
        {
            id: "1",
            bodyPart: "front-left-hand",
            condition: "Bruising",
            position: {
                top: "20%",
                left: "10%",
                width: "30px",
                height: "100px"
            }
        },
        {
            id: "2",
            bodyPart: "back",
            condition: "Rash",
            position: {
                top: "16%",
                left: "32%",
                width: "50px",
                height: "100px"
            }
        }
    ]

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
                            <h1 className="text-lg font-semibold text-gray-900">{report.client?.fullName}</h1>
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
                            <div className={`flex items-center text-xs ${getStatusColor(report.status)} rounded-md px-2 py-1 font-medium`}>
                                {getStatusIcon(report.status)}
                                <div className="text-xs">{report.status}</div>
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
                                    <p className="text-sm font-medium">{report.visitType?.name || 'Standard Visit'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Client</p>
                                    <p className="text-sm font-medium">{report.client?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Care worker</p>
                                    <p className="text-sm font-medium">{report.caregiver?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Duration</p>
                                    <p className="text-sm font-medium">2m</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-xs text-gray-600">Check in date:</p>
                                        <p className="text-sm font-medium">{formatDate(report.checkInTime, "HH:mm")}</p>
                                        <p className="text-xs text-gray-500">{formatDate(report.checkInTime, "d MMM yyyy")}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Check out date:</p>
                                        <p className="text-sm font-medium">{formatDate(report.checkOutTime, "HH:mm")}</p>
                                        <p className="text-xs text-gray-500">{formatDate(report.checkOutTime, "d MMM yyyy")}</p>
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
                                    {loadError ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                                <p className="text-sm text-red-600">Failed to load map</p>
                                            </div>
                                        </div>
                                    ) : isMapLoaded ? (
                                        <div className="w-full h-full p-2 rounnded-lg">
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
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                                <p className="text-sm text-gray-600">Loading map...</p>
                                            </div>
                                        </div>
                                    )}
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
                                                <p className="text-sm font-medium">{formatDate(report.checkInTime, "HH:mm")}</p>
                                                <p className="text-xs text-gray-500">{report.checkInDistance} meters from client's home</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                                                <p className="text-xs font-medium">Check-out</p>
                                            </div>
                                            <div className="pl-5 space-y-1">
                                                <p className="text-xs text-gray-600">Time:</p>
                                                <p className="text-sm font-medium">{formatDate(report.checkOutTime, "HH:mm")}</p>
                                                <p className="text-xs text-gray-500">{report.checkOutDistance} meters from client's home</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {mockAlerts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3">
                                    {mockAlerts
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
                                                            <span className="text-xs text-gray-600 whitespace-nowrap ml-2">{alert.time}</span>
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
                                <div className="space-y-3">
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
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-700">
                                            <span className="font-medium">General note:</span> Looking good overall
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>



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


                        </div>


                    </div>



                    {/* Tasks Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Tasks Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {mockTasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-medium truncate">{task.taskName}</h4>
                                                {task.completedAt && (
                                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                        {new Date(task.completedAt).toLocaleTimeString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2">{task.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Visit completed successfully with one medication alert requiring follow-up. Client was in good spirits
                                and cooperative throughout the visit. All scheduled tasks were completed satisfactorily. Location
                                check-in was slightly outside designated area but verified as correct with client. Overall visit was
                                positive with good client engagement.
                            </p>
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