export const formatSubrole = (subrole: string) => {
    const subroleMap: Record<string, string> = {
        CAREGIVER: "Caregiver",
        SERVICE_USER: "Service User",
        FAMILY_AND_FRIENDS: "Family and Friends",
        SOFTWARE_OWNER: "Software Owner",
        ADMIN: "Admin",
        OFFICE_STAFF: "Office Staff",
        FINANCE_MANAGER: "Finance Manager",
        HR_MANAGER: "HR Manager",
        CARE_MANAGER: "Care Manager",
        SCHEDULING_COORDINATOR: "Scheduling Coordinator",
        OFFICE_ADMINISTRATOR: "Office Administrator",
        RECEPTIONIST: "Receptionist",
        QUALITY_ASSURANCE_MANAGER: "Quality Assurance Manager",
        MARKETING_COORDINATOR: "Marketing Coordinator",
        COMPLIANCE_OFFICER: "Compliance Officer",
        SENIOR_CAREGIVER: "Senior Caregiver",
        JUNIOR_CAREGIVER: "Junior Caregiver",
        TRAINEE_CAREGIVER: "Trainee Caregiver",
        LIVE_IN_CAREGIVER: "Live-in Caregiver",
        PART_TIME_CAREGIVER: "Part-time Caregiver",
        SPECIALIZED_CAREGIVER: "Specialized Caregiver",
        NURSING_ASSISTANT: "Nursing Assistant",
        OTHER: "Other"
    }
    return subroleMap[subrole] || subrole
} 