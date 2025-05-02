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
    getAllDocumentsByAgencyId,
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




// Agency GET routes
router.get("/", getAllAgencies);
router.get("/:id", getAgencyById);

// Agency POST routes
router.post("/", createAgency);

// Agency PUT routes
router.put("/:id", updateAgency);
router.delete("/:id", deleteAgency);

//I made these routes for the agency details page
router.get("/:id/custom-tasks", getAgencyCustomTasks);
router.get("/:id/groups", getAgencyGroups);
router.get("/:id/rate-sheets", getAgencyRateSheets);

router.put("/:id/custom-task", updateAgencyCustomTask);

router.put("/:id/rate-sheet", updateAgencyRateSheet);

router.post("/:id/rate-sheet", createAgencyRateSheet);
router.delete("/:id/rate-sheet/:rateSheetId", deleteAgencyRateSheet);

router.put("/:id/group/:groupId", updateAgencyGroup);
router.post("/:id/group", createAgencyGroup);
router.delete("/:id/group/:groupId", deleteAgencyGroup);

// Agency relationship routes
router.get("/:id/users", getAllUsersByAgencyId);
router.get("/:id/schedules", getAllSchedulesByAgencyId);
router.get("/:id/clients", getAllClientsByAgencyId);
router.get("/:id/invoices", getAllInvoicesByAgencyId);
router.get("/:id/mileage-records", getAllMileageRecordsByAgencyId);
router.get("/:id/incident-reports", getAllIncidentReportsByAgencyId);
router.get("/:id/documents", getAllDocumentsByAgencyId);

export default router;
