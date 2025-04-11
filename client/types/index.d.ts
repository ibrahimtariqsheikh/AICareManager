import { LucideIcon } from "lucide-react";
import { AuthUser } from "aws-amplify/auth";
import { MotionProps as OriginalMotionProps } from "framer-motion";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {


  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
  }

  interface ContactWidgetProps {
    onOpenModal: () => void;
  }

  interface ImagePreviewsProps {
    images: string[];
  }

  interface PropertyDetailsProps {
    propertyId: number;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface PropertyLocationProps {
    propertyId: number;
  }

  interface ApplicationCardProps {
    application: Application;
    userType: "" | "";
    children: React.ReactNode;
  }

  interface CardProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface CardCompactProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface HeaderProps {
    title: string;
    subtitle: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: "" | "";
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: "" | "";
  }

  interface User {
    lastName: ReactNode;
    firstName: ReactNode;
    cognitoInfo: AuthUser;
    userInfo: {
      id: string;
      username: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
    userRole: JsonObject | JsonPrimitive | JsonArray;
  }

  interface Report {
    id: string;
    clientId: string;
    agencyId: string;
    userId: string;
    condition: string;
    summary: string;
    checkInTime: Date;
    checkOutTime?: Date;
    createdAt: Date;
    checkInDistance?: number;
    checkOutDistance?: number;
    checkInLocation?: string;
    checkOutLocation?: string;
    hasSignature: boolean;
    signatureImageUrl?: string;
    status: ReportStatus;
    lastEditedAt?: Date;
    lastEditedBy?: string;
    lastEditReason?: string;
    tasksCompleted: ReportTask[];
    alerts: ReportAlert[];
    bodyMapObservations: BodyMapObservation[];
    medicationAdministrations: MedicationAdministration[];
    editHistory: ReportEdit[];
    client: User;
    caregiver: User;
    agency: Agency;
  }

}

export interface Report {
  id: string;
  clientId: string;
  agencyId: string;
  userId: string;
  condition: string;
  summary: string;
  checkInTime: Date;
  checkOutTime?: Date;
  createdAt: Date;
  checkInDistance?: number;
  checkOutDistance?: number;
  checkInLocation?: string;
  checkOutLocation?: string;
  hasSignature: boolean;
  signatureImageUrl?: string;
  status: ReportStatus;
  lastEditedAt?: Date;
  lastEditedBy?: string;
  lastEditReason?: string;
  tasksCompleted: ReportTask[];
  alerts: ReportAlert[];
  bodyMapObservations: BodyMapObservation[];
  medicationAdministrations: MedicationAdministration[];
  editHistory: ReportEdit[];
  client: User;
  caregiver: User;
  agency: Agency;
}

export {};
