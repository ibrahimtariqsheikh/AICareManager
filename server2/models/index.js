import mongoose from 'mongoose';
const { Schema } = mongoose;

// Enums
const Role = {
  SOFTWARE_OWNER: 'SOFTWARE_OWNER',
  ADMIN: 'ADMIN',
  CARE_WORKER: 'CARE_WORKER',
  OFFICE_STAFF: 'OFFICE_STAFF',
  CLIENT: 'CLIENT',
  FAMILY: 'FAMILY'
};

const SubRole = {
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  HR_MANAGER: 'HR_MANAGER',
  CARE_MANAGER: 'CARE_MANAGER',
  SCHEDULING_COORDINATOR: 'SCHEDULING_COORDINATOR',
  OFFICE_ADMINISTRATOR: 'OFFICE_ADMINISTRATOR',
  RECEPTIONIST: 'RECEPTIONIST',
  QUALITY_ASSURANCE_MANAGER: 'QUALITY_ASSURANCE_MANAGER',
  MARKETING_COORDINATOR: 'MARKETING_COORDINATOR',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  CAREGIVER: 'CAREGIVER',
  SENIOR_CAREGIVER: 'SENIOR_CAREGIVER',
  JUNIOR_CAREGIVER: 'JUNIOR_CAREGIVER',
  TRAINEE_CAREGIVER: 'TRAINEE_CAREGIVER',
  LIVE_IN_CAREGIVER: 'LIVE_IN_CAREGIVER',
  PART_TIME_CAREGIVER: 'PART_TIME_CAREGIVER',
  SPECIALIZED_CAREGIVER: 'SPECIALIZED_CAREGIVER',
  NURSING_ASSISTANT: 'NURSING_ASSISTANT',
  SERVICE_USER: 'SERVICE_USER',
  FAMILY_AND_FRIENDS: 'FAMILY_AND_FRIENDS',
  OTHER: 'OTHER'
};

const InvitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED'
};

const DayOfWeek = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY'
};

const AnnouncementPriority = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

const AnnouncementStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  ARCHIVE: 'ARCHIVE',
  RESTORE: 'RESTORE',
  SYSTEM: 'SYSTEM'
};

const ScheduleType = {
  WEEKLY_CHECKUP: 'WEEKLY_CHECKUP',
  APPOINTMENT: 'APPOINTMENT',
  HOME_VISIT: 'HOME_VISIT',
  CHECKUP: 'CHECKUP',
  EMERGENCY: 'EMERGENCY',
  ROUTINE: 'ROUTINE',
  OTHER: 'OTHER'
};

const ReportStatus = {
  DRAFT: 'DRAFT',
  COMPLETED: 'COMPLETED',
  EDITED: 'EDITED',
  FLAGGED: 'FLAGGED',
  REVIEWED: 'REVIEWED'
};

const AlertType = {
  MEDICATION: 'MEDICATION',
  INCIDENT: 'INCIDENT',
  HEALTH_CHANGE: 'HEALTH_CHANGE',
  BEHAVIOR: 'BEHAVIOR',
  MISSED_TASK: 'MISSED_TASK',
  OTHER: 'OTHER'
};

const AlertSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

const DoseType = {
  MORNING: 'MORNING',
  LUNCH: 'LUNCH',
  EVENING: 'EVENING',
  BEDTIME: 'BEDTIME',
  AS_NEEDED: 'AS_NEEDED'
};

// Schemas
const InvitationSchema = new Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(Role), required: true },
  subRole: { type: String, enum: Object.values(SubRole) },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: Object.values(InvitationStatus), default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
  inviterId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const AgencySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, default: 'example@agency.com' },
  description: String,
  address: String,
  extension: Number,
  mobileNumber: Number,
  landlineNumber: Number,
  website: String,
  logo: String,
  primaryColor: String,
  secondaryColor: String,
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  hasScheduleV2: { type: Boolean, default: true },
  hasEMAR: { type: Boolean, default: false },
  hasFinance: { type: Boolean, default: false },
  isWeek1And2ScheduleEnabled: { type: Boolean, default: false },
  hasPoliciesAndProcedures: { type: Boolean, default: false },
  isTestAccount: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  licenseNumber: String,
  timeZone: { type: String, default: 'UTC' },
  currency: { type: String, default: 'CAD' },
  maxUsers: Number,
  maxClients: Number,
  maxCareWorkers: Number,
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const OperatingHoursSchema = new Schema({
  dayOfWeek: { type: String, enum: Object.values(DayOfWeek), required: true },
  isOpen: { type: Boolean, default: true },
  openTime: { type: String, default: '09:00' },
  closeTime: { type: String, default: '17:00' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true }
});

const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: Object.values(AnnouncementPriority), default: 'NORMAL' },
  status: { type: String, enum: Object.values(AnnouncementStatus), default: 'DRAFT' },
  publishDate: Date,
  expiryDate: Date,
  isSticky: { type: Boolean, default: false },
  requiresAcknowledgment: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  createdById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetRoles: [{ type: String, enum: Object.values(Role) }],
  attachmentUrl: String,
  attachmentType: String,
  acknowledgedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  indexes: [
    { agencyId: 1 },
    { publishDate: 1 },
    { status: 1 }
  ]
});

const AuditLogSchema = new Schema({
  action: { type: String, enum: Object.values(AuditAction), required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  description: { type: String, required: true },
  changes: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  performedAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  indexes: [
    { agencyId: 1 },
    { userId: 1 },
    { entityType: 1, entityId: 1 },
    { performedAt: 1 }
  ]
});

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  certificationCode: String,
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, default: 'ACTIVE' },
  documentUrl: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true }
}, {
  indexes: [
    { agencyId: 1 }
  ]
});

const GroupSchema = new Schema({
  name: { type: String, required: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  clients: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const RateSheetSchema = new Schema({
  name: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  staffType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' }
});

const CustomTaskSchema = new Schema({
  name: { type: String, required: true },
  placeholder: { type: String, required: true },
  category: { type: String, required: true },
  frequency: { type: String, required: true },
  priority: { type: String, required: true },
  icon: String,
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' }
});

const ClientCareAssignmentSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isDecisionMaker: { type: Boolean, default: false },
  assignedAt: { type: Date, default: Date.now }
});

// Create a compound unique index
ClientCareAssignmentSchema.index({ clientId: 1, userId: 1 }, { unique: true });

const CommunicationPreferenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  phone: { type: Boolean, default: true },
  notes: String
});

const FamilyAccessSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  email: String
});

const MedicationDatabaseLinkSchema = new Schema({
  name: { type: String, required: true },
  isSpecialist: { type: Boolean, default: false },
  url: { type: String, required: true },
  source: { type: String, required: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true }
});

const VisitTypeSchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ScheduleSchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'PENDING' },
  type: { type: String, enum: Object.values(ScheduleType), default: 'APPOINTMENT' },
  notes: String,
  chargeRate: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  visitTypeId: { type: Schema.Types.ObjectId, ref: 'VisitType' }
}, {
  indexes: [
    { userId: 1, date: 1 },
    { clientId: 1, date: 1 },
    { agencyId: 1 },
    // Compound unique index
    { userId: 1, clientId: 1, date: 1, startTime: 1, endTime: 1 }
  ]
});

const ReportTaskSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  taskName: { type: String, required: true },
  completed: { type: Boolean, default: false },
  notes: String,
  taskIcon: String,
  taskType: String,
  completedAt: Date
});

const ReportAlertSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  type: { type: String, enum: Object.values(AlertType), required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: Object.values(AlertSeverity), required: true },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  resolvedAt: Date,
  resolvedBy: String
});

const BodyMapObservationSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  bodyPart: { type: String, required: true },
  condition: { type: String, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const ReportEditSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  editedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  editedAt: { type: Date, default: Date.now },
  reason: { type: String, required: true },
  changesJson: { type: String, required: true }
});

const ReportSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  condition: { type: String, required: true },
  summary: { type: String, required: true },
  checkInTime: { type: Date, required: true },
  checkOutTime: Date,
  createdAt: { type: Date, default: Date.now },
  checkInDistance: Number,
  checkOutDistance: Number,
  checkInLocation: String,
  checkOutLocation: String,
  hasSignature: { type: Boolean, default: false },
  signatureImageUrl: String,
  status: { type: String, enum: Object.values(ReportStatus), default: 'COMPLETED' },
  lastEditedAt: Date,
  lastEditedBy: String,
  lastEditReason: String,
  bodyMapObservations: [BodyMapObservationSchema],
  alerts: [ReportAlertSchema],
  tasksCompleted: [ReportTaskSchema]
});

const MedicationRecordSchema = new Schema({
  medicationId: { type: Schema.Types.ObjectId, ref: 'MedicationDatabaseLink', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  morningDose: { type: Boolean, default: false },
  lunchDose: { type: Boolean, default: false },
  eveningDose: { type: Boolean, default: false },
  bedtimeDose: { type: Boolean, default: false },
  asNeededDose: { type: Boolean, default: false }
}, {
  indexes: [
    { medicationId: 1 },
    { clientId: 1 },
    { userId: 1 }
  ]
});

const MedicationAdministrationSchema = new Schema({
  medicationRecordId: { type: Schema.Types.ObjectId, ref: 'MedicationRecord', required: true },
  administeredById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  administeredAt: { type: Date, required: true },
  doseType: { type: String, enum: Object.values(DoseType), required: true },
  doseTaken: { type: Boolean, default: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  reportId: { type: Schema.Types.ObjectId, ref: 'Report' }
}, {
  indexes: [
    { medicationRecordId: 1 },
    { administeredById: 1 }
  ]
});

const InvoiceSchema = new Schema({
  invoiceNumber: { type: Number, required: true, unique: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  status: { type: String, required: true }
});

const MileageRecordSchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startMileage: { type: Number, required: true },
  endMileage: { type: Number, required: true },
  totalMiles: { type: Number, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  indexes: [
    { agencyId: 1 },
    { clientId: 1 },
    { userId: 1 }
  ]
});

const DocumentSchema = new Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' }
});

const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: String,
  avatarUrl: String,
  address: String
});

const IncidentReportSchema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  description: { type: String, required: true },
  severity: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now }
});

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

const KeyContactSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  email: String
});

const CareOutcomeSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  outcome: { type: String, required: true }
});

const CommunicationLogSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const RiskCategorySchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const RiskAssessmentSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  riskCategoryId: { type: Schema.Types.ObjectId, ref: 'RiskCategory', required: true },
  description: { type: String, required: true },
  affectedParties: { type: String, required: true },
  mitigationStrategy: { type: String, required: true },
  likelihood: { type: Number, required: true },
  severity: { type: Number, required: true },
  riskScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ReminderSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: String,
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' }
});

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  indexes: [
    { userId: 1 }
  ]
});

// User schema with references to all related collections
const UserSchema = new Schema({
  cognitoId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, default: '' },
  preferredName: String,
  role: { type: String, enum: Object.values(Role), required: true },
  subRole: { type: String, enum: Object.values(SubRole) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
  invitedById: { type: Schema.Types.ObjectId, ref: 'User' },
  address: String,
  city: String,
  province: String,
  postalCode: String,
  propertyAccess: String,
  phoneNumber: String,
  nhsNumber: String,
  dnraOrder: { type: Boolean, default: false },
  mobility: String,
  likesDislikes: String,
  dateOfBirth: Date,
  languages: String,
  allergies: String,
  interests: String,
  history: String
}, { timestamps: true });

// Create models
const models = {
  Invitation: mongoose.model('Invitation', InvitationSchema),
  Agency: mongoose.model('Agency', AgencySchema),
  OperatingHours: mongoose.model('OperatingHours', OperatingHoursSchema),
  Announcement: mongoose.model('Announcement', AnnouncementSchema),
  AuditLog: mongoose.model('AuditLog', AuditLogSchema),
  Certification: mongoose.model('Certification', CertificationSchema),
  Group: mongoose.model('Group', GroupSchema),
  RateSheet: mongoose.model('RateSheet', RateSheetSchema),
  CustomTask: mongoose.model('CustomTask', CustomTaskSchema),
  ClientCareAssignment: mongoose.model('ClientCareAssignment', ClientCareAssignmentSchema),
  User: mongoose.model('User', UserSchema),
  CommunicationPreference: mongoose.model('CommunicationPreference', CommunicationPreferenceSchema),
  FamilyAccess: mongoose.model('FamilyAccess', FamilyAccessSchema),
  MedicationDatabaseLink: mongoose.model('MedicationDatabaseLink', MedicationDatabaseLinkSchema),
  VisitType: mongoose.model('VisitType', VisitTypeSchema),
  Schedule: mongoose.model('Schedule', ScheduleSchema),
  Report: mongoose.model('Report', ReportSchema),
  ReportTask: mongoose.model('ReportTask', ReportTaskSchema),
  ReportAlert: mongoose.model('ReportAlert', ReportAlertSchema),
  BodyMapObservation: mongoose.model('BodyMapObservation', BodyMapObservationSchema),
  ReportEdit: mongoose.model('ReportEdit', ReportEditSchema),
  MedicationRecord: mongoose.model('MedicationRecord', MedicationRecordSchema),
  MedicationAdministration: mongoose.model('MedicationAdministration', MedicationAdministrationSchema),
  Invoice: mongoose.model('Invoice', InvoiceSchema),
  MileageRecord: mongoose.model('MileageRecord', MileageRecordSchema),
  Document: mongoose.model('Document', DocumentSchema),
  Profile: mongoose.model('Profile', ProfileSchema),
  IncidentReport: mongoose.model('IncidentReport', IncidentReportSchema),
  Message: mongoose.model('Message', MessageSchema),
  KeyContact: mongoose.model('KeyContact', KeyContactSchema),
  CareOutcome: mongoose.model('CareOutcome', CareOutcomeSchema),
  CommunicationLog: mongoose.model('CommunicationLog', CommunicationLogSchema),
  RiskCategory: mongoose.model('RiskCategory', RiskCategorySchema),
  RiskAssessment: mongoose.model('RiskAssessment', RiskAssessmentSchema),
  Reminder: mongoose.model('Reminder', ReminderSchema),
  Notification: mongoose.model('Notification', NotificationSchema)
};

// Export named models for ES Modules
export const User = models.User;
export const Agency = models.Agency;
export const Invitation = models.Invitation;
export const OperatingHours = models.OperatingHours;
export const Announcement = models.Announcement;

// Default export
export default models;