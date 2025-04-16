import express, { Router } from "express";
import {
    getAllAgencies,
    getAgencyById,
    createAgency,
    updateAgency,
    deleteAgency,
    getAllUsersByAgencyId,
    getAllSchedulesByAgencyId,
    getAllClientsByAgencyId,
    getAllInvoicesByAgencyId,
    getAllMileageRecordsByAgencyId,
    getAllIncidentReportsByAgencyId,
    getAllMedicationRecordsByAgencyId,
    getAllDocumentsByAgencyId,
    getAllMedicationDatabaseLinksByAgencyId,
    getAgencyCustomTasks,
    getAgencyGroups,
    getAgencyRateSheets,
    updateAgencyCustomTask,
    updateAgencyRateSheet,
    createAgencyRateSheet,
    deleteAgencyRateSheet,
    updateAgencyGroup,
    deleteAgencyGroup,
    createAgencyGroup
} from "../controllers/agencyController";

const router = express.Router();

// Agency CRUD routes
router.get("/", getAllAgencies);
router.get("/:id", getAgencyById);
router.post("/", createAgency);
router.put("/:id", updateAgency);
router.delete("/:id", deleteAgency);

//I made these
router.get("/:id/custom-tasks", getAgencyCustomTasks);
router.get("/:id/groups", getAgencyGroups);
router.get("/:id/rate-sheets", getAgencyRateSheets);

router.put("/:id/custom-task", updateAgencyCustomTask);

router.put("/:id/rate-sheet", updateAgencyRateSheet);

router.post("/:id/rate-sheet", createAgencyRateSheet);
router.delete("/:id/rate-sheet/:rateSheetId", deleteAgencyRateSheet);

router.put("/:id/group", updateAgencyGroup);
router.put("/:id/group", createAgencyGroup);
router.delete("/:id/group/:groupId", deleteAgencyGroup);

// Agency relationship routes
router.get("/:id/users", getAllUsersByAgencyId);
router.get("/:id/schedules", getAllSchedulesByAgencyId);
router.get("/:id/clients", getAllClientsByAgencyId);
router.get("/:id/invoices", getAllInvoicesByAgencyId);
router.get("/:id/mileage-records", getAllMileageRecordsByAgencyId);
router.get("/:id/incident-reports", getAllIncidentReportsByAgencyId);
router.get("/:id/medication-records", getAllMedicationRecordsByAgencyId);
router.get("/:id/documents", getAllDocumentsByAgencyId);
router.get("/:id/medication-database-links", getAllMedicationDatabaseLinksByAgencyId);

export default router;
