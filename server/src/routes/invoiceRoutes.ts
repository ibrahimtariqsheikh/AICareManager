import express, { Router } from "express";
import { getCurrentInvoiceNumber, getInvoiceDashboardData, getExpensesByDateRange, getScheduleHoursByDateRange, createPayroll, createInvoice, createExpense } from "../controllers/invoiceController";

const router = express.Router();

router.get("/current-invoice-number", getCurrentInvoiceNumber);
router.get("/dashboard-data/:agencyId", getInvoiceDashboardData);
router.get("/expenses/date-range", getExpensesByDateRange);
router.get("/schedule-hours/date-range", getScheduleHoursByDateRange);
router.post("/payroll", createPayroll);
router.post("/expense", createExpense);
router.post("/invoice", createInvoice);


export default router;