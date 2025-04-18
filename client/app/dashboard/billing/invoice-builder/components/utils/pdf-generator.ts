import { jsPDF } from "jspdf"
import { format } from "date-fns"
import type { InvoiceData, InvoiceItem } from "../../types"
import { User } from "@/types/prismaTypes"
import { DateRange } from "react-big-calendar"

export function generatePDF(
  client: User,
  invoiceData: InvoiceData,
  items: InvoiceItem[],
  subtotal: number,
  tax: number,
  total: number,
  dateRange: DateRange | null,
): jsPDF {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Define colors to match the preview
    const textColor = "#1f2937" // Dark gray for main text
    const secondaryTextColor = "#6b7280" // Medium gray for secondary text

    // Add company logo/name
    doc.setFontSize(24)
    doc.setTextColor(textColor)
    doc.text("INVOICE", 20, 20)

    // Add company info
    doc.setFontSize(10)
    doc.setTextColor(secondaryTextColor)
    doc.text("AI Care Manager", 20, 30)
    doc.text("123 Care Street", 20, 35)
    doc.text("Toronto, ON M5V 2K4", 20, 40)
    doc.text("Canada", 20, 45)
    doc.text("contact@aicaremanager.com", 20, 50)
    doc.text("+1 (416) 555-1234", 20, 55)

    // Add company logo box
    doc.setFillColor(79, 70, 229) // #4f46e5 primary color
    doc.rect(170, 20, 16, 16, "F")
    doc.setTextColor(255, 255, 255) // White text
    doc.setFontSize(12)
    doc.text("ACM", 178, 30, { align: "center" })

    // Add invoice details
    doc.setFontSize(10)
    doc.setTextColor(secondaryTextColor)
    doc.text(`Invoice #${invoiceData.invoiceNumber ?? ""}`, 170, 45, { align: "right" })
    doc.text(`Issue Date: ${invoiceData.issueDate ? format(new Date(invoiceData.issueDate), "MMM d, yyyy") : "-"}`, 170, 50, { align: "right" })
    doc.text(`Due Date: ${invoiceData.dueDate ? format(new Date(invoiceData.dueDate), "MMM d, yyyy") : "-"}`, 170, 55, { align: "right" })

    // Add client info
    doc.setFontSize(12)
    doc.setTextColor(textColor)
    doc.text("Bill To:", 20, 70)

    doc.setFontSize(10)
    doc.setTextColor(secondaryTextColor)
    doc.text(client.firstName + " " + client.lastName ?? "", 20, 82)
  

    // Add service period
    doc.setFontSize(12)
    doc.setTextColor(textColor)
    doc.text("Service Period:", 20, 115)

    doc.setFontSize(10)
    doc.setTextColor(secondaryTextColor)
    if (dateRange?.from && dateRange?.to) {
      doc.text(`${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`, 20, 122)
    }

    // Add table headers
    const tableTop = 130
    const tableLeft = 20
    const colWidths: [number, number, number, number] = [80, 30, 30, 30]

    doc.setFillColor(245, 245, 245)
    doc.rect(
      tableLeft,
      tableTop,
      colWidths.reduce((a, b) => a + b, 0),
      10,
      "F",
    )

    doc.setFontSize(10)
    doc.setTextColor(textColor)
    doc.text("Description", tableLeft + 5, tableTop + 6)
    doc.text("Quantity", tableLeft + colWidths[0] + 5, tableTop + 6)
    doc.text("Rate", tableLeft + colWidths[0] + colWidths[1] + 5, tableTop + 6)
    doc.text("Amount", tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 6)

    // Add table rows
    let yPos = tableTop + 10
    doc.setTextColor(secondaryTextColor)

    items.forEach((item, index) => {
      // Add a new page if we're about to overflow
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      doc.text(item.description || "", tableLeft + 5, yPos + 6)
      doc.text(item.quantity.toString(), tableLeft + colWidths[0] + 5, yPos + 6, { align: "right" })
      doc.text(`$${item.rate.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + 5, yPos + 6, { align: "right" })
      doc.text(`$${item.amount.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
        align: "right",
      })

      // Add a light gray line
      if (index < items.length - 1) {
        doc.setDrawColor(220, 220, 220)
        doc.line(tableLeft, yPos + 10, tableLeft + colWidths.reduce((a, b) => a + b, 0), yPos + 10)
      }

      yPos += 10
    })

    // Add totals
    yPos += 5
    const totalsX = tableLeft + colWidths[0] + colWidths[1] + 5

    doc.text("Subtotal:", totalsX, yPos + 6)
    doc.text(`$${subtotal.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
      align: "right",
    })

    yPos += 10

    if (invoiceData?.taxEnabled && invoiceData.taxRate != null) {
      doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, yPos + 6)
      doc.text(`$${tax.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
        align: "right",
      })
      yPos += 10
    }

    doc.setFontSize(12)
    doc.setTextColor(textColor)
    doc.text("Total:", totalsX, yPos + 6)
    doc.text(`$${total.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
      align: "right",
    })

    // Add notes if any
    if (invoiceData.notes != null && invoiceData.notes !== "") {
      yPos += 20

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.setTextColor(textColor)
      doc.text("Notes:", tableLeft, yPos)

      doc.setFontSize(10)
      doc.setTextColor(secondaryTextColor)

      // Split notes into lines to avoid overflow
      const splitNotes = doc.splitTextToSize(invoiceData.notes, 170)
      doc.text(splitNotes, tableLeft, yPos + 10)
    }

    // Add footer
    doc.setFontSize(10)
    doc.setTextColor(secondaryTextColor)
    doc.text("Thank you for your business!", 105, 280, { align: "center" })
    doc.text(
      invoiceData.dueDate
        ? `Payment is due by ${format(new Date(invoiceData.dueDate), "MMM d, yyyy")}`
        : "Payment is due upon receipt",
      105,
      285,
      { align: "center" },
    )

    return doc
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}
