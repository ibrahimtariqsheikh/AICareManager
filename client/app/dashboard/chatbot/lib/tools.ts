import { tool as createTool } from 'ai';
import { z } from 'zod';

export const displayScheduleAppointmentTool = createTool({
  description: 'Display the schedule for a care worker',
  parameters: z.object({
    client_name: z.string().describe('The name of the client'),
   
  }),
  execute: async function ({ client_name }) {
    if (!client_name) {
      throw new Error('Please provide a client name to get the schedule for');
    }
    return { client_name };
  },
});

export const scheduleTool = createTool({
  description: 'Display the schedule for a care worker',
  parameters: z.object({
    careWorker_name: z.string().describe('The name of the care worker'),
    client_name: z.string().describe('The name of the client'),
    start_time: z.string().describe('The start time of the schedule'),
    end_time: z.string().describe('The end time of the schedule'),
    date: z.string().describe('The date of the schedule'),
  }),
  execute: async function ({ careWorker_name, client_name, start_time, end_time, date }) {
    return { careWorker_name, client_name, start_time, end_time, date };
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
  description: 'View unresolved alerts for the current month',
  parameters: z.object({
    month: z.string().describe('The month to check alerts for'),
    year: z.string().describe('The year to check alerts for'),
  }),
  execute: async function ({ month, year }) {
    return { month, year, status: 'pending' };
  },
});

export const createClientProfileTool = createTool({
  description: 'Create a new client profile',
  parameters: z.object({
    name: z.string().describe('The name of the client'),
    address: z.string().describe('The address of the client'),
    start_date: z.string().describe('The start date for client services'),
    care_type: z.string().describe('The type of care required'),
  }),
  execute: async function ({ name, address, start_date, care_type }) {
    // Simulate API call to create client
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Return success state with client details
    return {
      name,
      address,
      start_date,
      care_type,
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
  }),
  execute: async function ({ client_name, date, time }) {
    return { client_name, date, time, status: 'pending' };
  },
});

export const sendMessageTool = createTool({
  description: 'Send message to all care workers',
  parameters: z.object({
    message: z.string().describe('The message to send'),
    channel: z.enum(['SMS', 'EMAIL']).describe('The channel to send the message through'),
  }),
  execute: async function ({ message, channel }) {
    return { message, channel, status: 'pending' };
  },
});

export const holidayRequestTool = createTool({
  description: 'View holiday requests',
  parameters: z.object({
    week: z.string().describe('The week to check holiday requests for'),
  }),
  execute: async function ({ week }) {
    return { week, status: 'pending' };
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
  }),
  execute: async function ({ name, email, include_training }) {
    return { name, email, include_training, status: 'pending' };
  },
});

export const generateCarePlanTool = createTool({
  description: 'Generate care plan draft',
  parameters: z.object({
    client_name: z.string().describe('The name of the client'),
    care_type: z.string().describe('The type of care required'),
    condition: z.string().describe('The medical condition of the client'),
  }),
  execute: async function ({ client_name, care_type, condition }) {
    return { client_name, care_type, condition, status: 'pending' };
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
