import express, { Router } from "express";
import { getCurrentInvoiceNumber } from "../controllers/invoiceController";

const router = express.Router();

router.get("/current-invoice-number", getCurrentInvoiceNumber);


// router.get("/", getInvoices);
// router.get("/:id", getInvoiceById);
// router.post("/", createInvoice);
// router.put("/:id", updateInvoice);
// router.delete("/:id", deleteInvoice);



export default router;