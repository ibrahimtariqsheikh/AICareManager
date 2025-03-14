import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  PawPrint,
  Tv,
  Thermometer,
  Cigarette,
  Cable,
  Maximize,
  Bath,
  Phone,
  Sprout,
  Hammer,
  Bus,
  Mountain,
  VolumeX,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
  BookPlus,
  Code,
  Database,
  Key,
  Settings,
  Star,
  Zap,
  PocketKnife,
  AudioWaveform,
  BarChart3,
  Calendar,
  Users,
} from "lucide-react";
import React from "react";

export enum AmenityEnum {
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Dishwasher = "Dishwasher",
  HighSpeedInternet = "HighSpeedInternet",
  HardwoodFloors = "HardwoodFloors",
  WalkInClosets = "WalkInClosets",
  Microwave = "Microwave",
  Refrigerator = "Refrigerator",
  Pool = "Pool",
  Gym = "Gym",
  Parking = "Parking",
  PetsAllowed = "PetsAllowed",
  WiFi = "WiFi",
}

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Dishwasher: Waves,
  HighSpeedInternet: Wifi,
  HardwoodFloors: Home,
  WalkInClosets: Maximize,
  Microwave: Tv,
  Refrigerator: Thermometer,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  PetsAllowed: PawPrint,
  WiFi: Wifi,
};

export enum HighlightEnum {
  HighSpeedInternetAccess = "HighSpeedInternetAccess",
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Heating = "Heating",
  SmokeFree = "SmokeFree",
  CableReady = "CableReady",
  SatelliteTV = "SatelliteTV",
  DoubleVanities = "DoubleVanities",
  TubShower = "TubShower",
  Intercom = "Intercom",
  SprinklerSystem = "SprinklerSystem",
  RecentlyRenovated = "RecentlyRenovated",
  CloseToTransit = "CloseToTransit",
  GreatView = "GreatView",
  QuietNeighborhood = "QuietNeighborhood",
}

export const HighlightIcons: Record<HighlightEnum, LucideIcon> = {
  HighSpeedInternetAccess: Wifi,
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Heating: Thermometer,
  SmokeFree: Cigarette,
  CableReady: Cable,
  SatelliteTV: Tv,
  DoubleVanities: Maximize,
  TubShower: Bath,
  Intercom: Phone,
  SprinklerSystem: Sprout,
  RecentlyRenovated: Hammer,
  CloseToTransit: Bus,
  GreatView: Mountain,
  QuietNeighborhood: VolumeX,
};

export enum PropertyTypeEnum {
  Rooms = "Rooms",
  Tinyhouse = "Tinyhouse",
  Apartment = "Apartment",
  Villa = "Villa",
  Townhouse = "Townhouse",
  Cottage = "Cottage",
}

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
  Rooms: Home,
  Tinyhouse: Warehouse,
  Apartment: Building,
  Villa: Castle,
  Townhouse: Home,
  Cottage: Trees,
};

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 52; // in pixels

// Test users for development
export const testUsers = {
  tenant: {
    username: "Carol White",
    userId: "us-east-2:76543210-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "carol.white@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  tenantRole: "tenant",
  manager: {
    username: "John Smith",
    userId: "us-east-2:12345678-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "john.smith@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  managerRole: "manager",
};

export type StepCard = {
  title: string;
  description: string;
  header: React.ReactNode;
  className: string;
  icon: React.ReactNode;
  key: string;
};

export const icons = [
  {
    value: "dashboard",
    label: "Dashboard",
    path: Home,
  },
  {
    value: "analytics",
    label: "Analytics",
    path: BarChart3,
  },
  {
    value: "schedule",
    label: "Schedule",
    path: Calendar,
  },
  {
    value: "users",
    label: "Users",
    path: Users,
  },
  {
    value: "settings",
    label: "Settings",
    path: Settings,
  },
];

export const frontPageCards = [
  {
    title: "Your Personal Study Assistant",
    description:
      "Try NoCodeBot.ai's personalised study assistant, simplifies your learning journey. It customises study sessions and offers instant help with homework, making education engaging and tailored to you. Embrace a smarter way to achieve your study goals with NoCodeBot.ai.",
  },
  {
    title: "Revolutionise Your Workflow with AI",
    description:
      "NoCodeBot AI transforms your office tasks with AI simplicity. It automates repetitive work, manages projects, and analyzes data effortlessly. Boost your productivity and streamline your workflow with NoCodeBot AI, where efficiency meets innovation.",
  },
];

export const pricingCards = [
  {
    title: "Starter",
    description: "Ideal for newcomers to AI",
    price: "Free",
    duration: "",
    highlight: "Essentials included",
    features: [
      "1 Workspace",
      "Basic AI Chatbot Builder",
      "Access to Community Models",
    ],
    priceId: "price_ibud78isuiuhsZJI",
  },
  {
    title: "Professional",
    description: "For teams deploying AI solutions",
    price: "$9.99",
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: [
      "Create unlimited Workspaces",
      "Advanced AI Chatbot Customization",
      "Customer Support",
      "Early Access to New Features",
    ],
    priceId: "price_1OYxkqFj9oKEERu1LmNvYzHJ",
  },
  {
    title: "Enterprise",
    description: "Comprehensive AI capabilities for large organizations",
    price: "$19.99",
    duration: "month",
    highlight: "All Professional features, plus",
    features: [
      "Custom AI Chatbot Development",
      "Dedicated GPT Model Training",
      "Enterprise-grade Security",
      "Personalized Onboarding & Support",
    ],
    priceId: "price_BID97hubx98hs0",
  },
];

export type FeaturedAssistant = {
  id: number;
  title: string;
  description: string;
  imgSrc: string;
};

export type SidebarOption = {
  heading: string;
  items: {
    name: string;
    icon: string;
    link: string;
  }[];
};

export const sidebarOpt: SidebarOption[] = [
  {
    heading: "",
    items: [
      { name: "Users", icon: "Users", link: "/dashboard/users" },
      { name: "Analytics", icon: "BarChart3", link: "/dashboard/analytics" },
      { name: "Schedule", icon: "Calendar", link: "/dashboard/schedule" },
      { name: "Settings", icon: "Settings", link: "/dashboard/settings" },
    ],
  },
  {
    heading: "",
    items: [],
  },
];

export type AssistantType = {
  id: string;
  name: string;
  description: string;
  allowedDomain: string[];
  // owner: string;
  // threadId: string;
};

export type ModelType = {
  modelId: string;
  modelName: string;
  baseModel: string;
  batchSize: number;
  createdAt: string;
  createdBy: string;
  deleted: string;
  epochs: number;
  jobId: string;
  learningRate: number;
  purpose: string;
  status: string;
  trainingFileId: string;
};

export type DomainType = {
  domain: string;
  assistantId: string;
};

export type DomainsType = {
  domain: string[];
  assistantId: string;
};

export type Membership = {
  workspaceName: string;
  userId: string;
  userEmail: string;
  role: string;
  createdAt: string;
};

export type AddDataBucketType = {
  datasetId: string;
  data: {
    id: string;
    name: string;
    path: string;
    createdBy: string;
    createdAt: string;
  };
};

export type DataBucketType = {
  id: string;
  name: string;
  path: string;
  createdBy: string;
  createdAt: string;
};

export type DeleteDataBucketType = {
  datasetId: string;
  dataId: string;
};

export type DatasetType = {
  id: string;
  name: string;
  description: string;
  data: DataBucketType[];
  createdBy: string | undefined;
  createdAt: string;
};

export type chatThreads = {
  id: string;
  name: string;
};

export const dummyChatThreads: chatThreads[] = [
  {
    id: "1",
    name: "Chat number 1: Welcome",
  },
  {
    id: "2",
    name: "Semantic Analysis with python",
  },
];
