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
  description: 'Create a new schedule entry',
  parameters: z.object({
    careWorker_name: z.string().describe('The name of the care worker'),
    client_name: z.string().describe('The name of the client'),
    start_time: z.string().describe('The start time of the schedule'),
    end_time: z.string().describe('The end time of the schedule'),
    date: z.string().describe('The date of the schedule'),
    type: z.enum(['WEEKLY_CHECKUP', 'APPOINTMENT', 'HOME_VISIT', 'CHECKUP', 'EMERGENCY', 'ROUTINE', 'OTHER']).describe('The type of schedule'),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']).describe('The status of the schedule'),
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
  description: 'Create a new client profile',
  parameters: z.object({
    fullName: z.string().describe('The full name of the client'),
    email: z.string().email().describe('The email of the client'),
    dateOfBirth: z.string().describe('The date of birth of the client'),
    role: z.enum(['CLIENT', 'FAMILY']).describe('The role of the user'),
    subRole: z.enum(['SERVICE_USER', 'FAMILY_AND_FRIENDS', 'OTHER']).optional().describe('The sub-role of the user'),
  }),
  execute: async function ({ fullName, email, dateOfBirth, role, subRole }) {
    await new Promise(resolve => setTimeout(resolve, 1000));
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
  description: 'Assign cover for a cancelled visit',
  parameters: z.object({
    client_name: z.string().describe('The name of the client'),
    date: z.string().describe('The date of the visit'),
    time: z.string().describe('The time of the visit'),
    careWorker_name: z.string().describe('The name of the care worker to assign'),
  }),
  execute: async function ({ client_name, date, time, careWorker_name }) {
    return { client_name, date, time, careWorker_name, status: 'pending' };
  },
});

export const sendMessageTool = createTool({
  description: 'Send message to all care workers',
  parameters: z.object({
    message: z.string().describe('The message to send'),
    channel: z.enum(['SMS', 'EMAIL']).describe('The channel to send the message through'),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).describe('The priority of the message'),
  }),
  execute: async function ({ message, channel, priority }) {
    return { message, channel, priority, status: 'pending' };
  },
});

export const holidayRequestTool = createTool({
  description: 'View holiday requests',
  parameters: z.object({
    week: z.string().describe('The week to check holiday requests for'),
    eventType: z.enum(['ANNUAL_LEAVE', 'SICK_LEAVE', 'PUBLIC_HOLIDAY', 'UNPAID_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'EMERGENCY_LEAVE', 'MEDICAL_APPOINTMENT', 'TOIL', 'OTHER']).describe('The type of leave event'),
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
  description: 'Send onboarding invite to new carer',
  parameters: z.object({
    name: z.string().describe('The name of the new carer'),
    email: z.string().email().describe('The email of the new carer'),
    include_training: z.boolean().describe('Whether to include training materials'),
    role: z.enum(['CARE_WORKER', 'OFFICE_STAFF']).describe('The role of the new carer'),
    subRole: z.enum(['CAREGIVER', 'SENIOR_CAREGIVER', 'JUNIOR_CAREGIVER', 'TRAINEE_CAREGIVER', 'LIVE_IN_CAREGIVER', 'PART_TIME_CAREGIVER', 'SPECIALIZED_CAREGIVER', 'NURSING_ASSISTANT', 'OTHER']).optional().describe('The sub-role of the new carer'),
  }),
  execute: async function ({ name, email, include_training, role, subRole }) {
    return { name, email, include_training, role, subRole, status: 'pending' };
  },
});

export const generateCarePlanTool = createTool({
  description: 'Generate care plan draft',
  parameters: z.object({
    client_name: z.string().describe('The name of the client'),
    care_type: z.string().describe('The type of care required'),
    condition: z.string().describe('The medical condition of the client'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('The priority level of the care plan'),
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
