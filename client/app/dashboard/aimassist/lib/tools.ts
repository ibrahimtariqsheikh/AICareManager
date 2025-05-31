import { tool as createTool } from 'ai';
import { z } from 'zod';

export const displayScheduleAppointmentTool = createTool({
  description: 'Show me the schedule',
  parameters: z.object({
    name: z.string().describe('The name'),
  }),
  execute: async function ({ name }) {
    if (!name) {
      throw new Error('Please provide a client name to get the schedule for');
    }
    return { name };
  },
});

export const scheduleTool = createTool({
  description: `Create a new schedule entry.

CRITICAL FORMATTING RULES FOR USER REQUESTS:
- Use markdown bullets (-) not asterisks (*)
- Use **Bold** for field names
- NEVER show technical enum values to users
- NEVER show format requirements
- Handle all format conversion automatically

CORRECT REQUEST FORMAT:
"To create a new schedule, I need the following information:

- **Care Worker Name** (the name of the care worker)
- **Client Name** (the name of the client)
- **Start Time** (what time would you like to start?)
- **End Time** (what time would you like to end?)
- **Date** (what date would you like to schedule this for?)
- **Type** (Weekly Checkup, Appointment, Home Visit, Checkup, Emergency, Routine, or Other)
- **Status** (Pending, Confirmed, Completed, or Canceled)

Please provide these details and I'll verify them before creating the schedule."

NEVER USE: WEEKLY_CHECKUP, PENDING, careWorker_name, client_name, format requirements`,
  parameters: z.object({
    careWorker_name: z.string().describe('The name of the care worker (display as "Care Worker Name" to users)'),
    client_name: z.string().describe('The name of the client (display as "Client Name" to users)'),
    start_time: z.string().describe('The start time of the schedule (display as "Start Time" to users, accept natural input like "9am")'),
    end_time: z.string().describe('The end time of the schedule (display as "End Time" to users, accept natural input like "5pm")'),
    date: z.string().describe('The date of the schedule (display as "Date" to users, accept natural input like "June 15th")'),
    type: z.enum(['WEEKLY_CHECKUP', 'APPOINTMENT', 'HOME_VISIT', 'CHECKUP', 'EMERGENCY', 'ROUTINE', 'OTHER']).describe('The type of schedule (display options as: Weekly Checkup, Appointment, Home Visit, Checkup, Emergency, Routine, or Other)'),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']).describe('The status of the schedule (display options as: Pending, Confirmed, Completed, or Canceled)'),
  }),
  execute: async function ({ careWorker_name, client_name, start_time, end_time, date, type, status }) {
    return { careWorker_name, client_name, start_time, end_time, date, type, status };
  },
});

export const generatePayrollTool = createTool({
  description: 'Generate payroll summary for the current month',
  parameters: z.object({
    month: z.string().describe('The month to generate payroll for'),
    year: z.string().describe('The year to generate payroll for'),
  }),
  execute: async function ({ month, year }) {
    return { month, year, status: 'pending' };
  },
});

export const viewAlertsTool = createTool({
  description: 'View unresolved alerts',
  parameters: z.object({}),
  execute: async function () {
    return { status: 'success', message: 'Retrieved unresolved alerts' };
  },
});

export const createClientProfileTool = createTool({
  description: `Create a new client profile. 

CRITICAL FORMATTING RULES FOR USER REQUESTS:
- Use markdown bullets (-) not asterisks (*)
- Use **Bold** for field names
- NEVER show technical enum values to users
- NEVER show format requirements like (format: YYYY-MM-DD)
- Handle all format conversion automatically

CORRECT REQUEST FORMAT:
"To create a new client profile, I need the following information:

- **Full Name** (the client's full name)
- **Email** (a valid email address)
- **Date of Birth** (the client's date of birth)
- **Role** (Client or Family)
- **Sub-Role** (Service User, Family and Friends, or Other)

Please provide these details and I'll verify them before creating the profile."

NEVER USE: CLIENT, FAMILY, SERVICE_USER, FAMILY_AND_FRIENDS, OTHER, fullName, dateOfBirth, format requirements`,
  parameters: z.object({
    fullName: z.string().describe('The full name of the client (display as "Full Name" to users)'),
    email: z.string().email().describe('The email of the client (display as "Email" to users)'),
    dateOfBirth: z.string().describe('The date of birth of the client (display as "Date of Birth" to users)'),
    role: z.enum(['CLIENT', 'FAMILY']).describe('The role of the user (display options as: Client or Family)'),
    subRole: z.enum(['SERVICE_USER', 'FAMILY_AND_FRIENDS', 'OTHER']).describe('The sub-role of the user (display options as: Service User, Family and Friends, or Other)'),
  }),
  execute: async function ({ fullName, email, dateOfBirth, role, subRole }) {
    return {
      fullName,
      email,
      dateOfBirth,
      role,
      subRole,
      status: 'active',
      success: true,
      toolName: 'createClientProfile'
    };
  },
});

export const assignCoverTool = createTool({
  description: 'Assign cover for a cancelled visit. When requesting information from users, use user-friendly field names: Client Name, Date, Time, Care Worker Name.',
  parameters: z.object({
    client_name: z.string().describe('The name of the client (display as "Client Name" to users)'),
    date: z.string().describe('The date of the visit (display as "Date" to users)'),
    time: z.string().describe('The time of the visit (display as "Time" to users)'),
    careWorker_name: z.string().describe('The name of the care worker to assign (display as "Care Worker Name" to users)'),
  }),
  execute: async function ({ client_name, date, time, careWorker_name }) {
    return { client_name, date, time, careWorker_name, status: 'pending' };
  },
});

export const sendMessageTool = createTool({
  description: 'Send message to all care workers. When requesting information from users, use user-friendly field names and enum options.',
  parameters: z.object({
    message: z.string().describe('The message to send (display as "Message" to users)'),
    channel: z.enum(['SMS', 'EMAIL']).describe('The channel to send the message through (display options as: SMS or Email)'),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).describe('The priority of the message (display options as: Low, Normal, High, or Urgent)'),
  }),
  execute: async function ({ message, channel, priority }) {
    return { message, channel, priority, status: 'pending' };
  },
});

export const holidayRequestTool = createTool({
  description: 'View holiday requests. When requesting information from users, use user-friendly field names and enum options.',
  parameters: z.object({
    week: z.string().describe('The week to check holiday requests for (display as "Week" to users)'),
    eventType: z.enum(['ANNUAL_LEAVE', 'SICK_LEAVE', 'PUBLIC_HOLIDAY', 'UNPAID_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'EMERGENCY_LEAVE', 'MEDICAL_APPOINTMENT', 'TOIL', 'OTHER']).describe('The type of leave event (display options as: Annual Leave, Sick Leave, Public Holiday, Unpaid Leave, Maternity Leave, Paternity Leave, Bereavement Leave, Emergency Leave, Medical Appointment, TOIL, or Other)'),
  }),
  execute: async function ({ week, eventType }) {
    return { week, eventType, status: 'pending' };
  },
});

export const generateRevenueReportTool = createTool({
  description: 'Generate revenue report',
  parameters: z.object({
    month: z.string().describe('The month to generate report for'),
    year: z.string().describe('The year to generate report for'),
  }),
  execute: async function ({ month, year }) {
    return { month, year, status: 'pending' };
  },
});

export const sendOnboardingInviteTool = createTool({
  description: 'Send onboarding invite to new carer. When requesting information from users, use user-friendly field names and enum options.',
  parameters: z.object({
    name: z.string().describe('The name of the new carer (display as "Name" to users)'),
    email: z.string().email().describe('The email of the new carer (display as "Email" to users)'),
    include_training: z.boolean().describe('Whether to include training materials (display as "Include Training" with Yes/No options to users)'),
    role: z.enum(['CARE_WORKER', 'OFFICE_STAFF']).describe('The role of the new carer (display options as: Care Worker or Office Staff)'),
    subRole: z.enum(['CAREGIVER', 'SENIOR_CAREGIVER', 'JUNIOR_CAREGIVER', 'TRAINEE_CAREGIVER', 'LIVE_IN_CAREGIVER', 'PART_TIME_CAREGIVER', 'SPECIALIZED_CAREGIVER', 'NURSING_ASSISTANT', 'OTHER']).optional().describe('The sub-role of the new carer (display options as: Caregiver, Senior Caregiver, Junior Caregiver, Trainee Caregiver, Live In Caregiver, Part Time Caregiver, Specialized Caregiver, Nursing Assistant, or Other - optional)'),
  }),
  execute: async function ({ name, email, include_training, role, subRole }) {
    return { name, email, include_training, role, subRole, status: 'pending' };
  },
});

export const generateCarePlanTool = createTool({
  description: 'Generate care plan draft. When requesting information from users, use user-friendly field names and enum options.',
  parameters: z.object({
    client_name: z.string().describe('The name of the client (display as "Client Name" to users)'),
    care_type: z.string().describe('The type of care required (display as "Care Type" to users)'),
    condition: z.string().describe('The medical condition of the client (display as "Condition" to users)'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('The priority level of the care plan (display options as: Low, Medium, or High)'),
  }),
  execute: async function ({ client_name, care_type, condition, priority }) {
    return { client_name, care_type, condition, priority, status: 'pending' };
  },
});

export const tools = {
  displayScheduleAppointment: displayScheduleAppointmentTool,
  createSchedule: scheduleTool,
  generatePayroll: generatePayrollTool,
  viewAlerts: viewAlertsTool,
  createClientProfile: createClientProfileTool,
  assignCover: assignCoverTool,
  sendMessage: sendMessageTool,
  holidayRequest: holidayRequestTool,
  generateRevenueReport: generateRevenueReportTool,
  sendOnboardingInvite: sendOnboardingInviteTool,
  generateCarePlan: generateCarePlanTool,
};