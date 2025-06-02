import { jsPDF } from "jspdf"
import { format } from "date-fns"
import type { User } from "@/types/prismaTypes"
import type { InvoiceItem, InvoiceData } from "../../types"

export function generatePDF(
  client: User,
  items: InvoiceItem[],
  subtotal: number,
  tax: number,
  total: number,
  invoiceData: InvoiceData
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  const textColor = "#1f2937"
  const secondaryTextColor = "#6b7280"
  const primaryColor = "#2563eb"

  // Set default font
  doc.setFont('helvetica', 'normal')

  // Header with logo
  doc.setFillColor(primaryColor)
  doc.rect(170, 20, 16, 16, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text("ACM", 178, 28, { align: "center" })

  // Invoice title
  doc.setFontSize(24)
  doc.setTextColor(textColor)
  doc.setFont('helvetica', 'bold')
  doc.text("INVOICE", margin, 28)
  doc.setFont('helvetica', 'normal')

  // Company Info
  doc.setFontSize(12)
  doc.setTextColor(textColor)
  doc.setFont('helvetica', 'bold')
  doc.text("AI Manager", margin, 38)
  doc.setFont('helvetica', 'normal')
  doc.text(client.addressLine1 || "", margin, 43)
  doc.text(client.addressLine2 || "", margin, 48)
  doc.text(client.townOrCity || "", margin, 53)
  doc.text(client.postalCode || "", margin, 58)
  doc.text("Canada", margin, 63)
  doc.text("contact@aimanager.com", margin, 68)
  doc.text("+1 (416) 555-1234", margin, 73)

  // Invoice Details
  doc.setFontSize(12)
  doc.setTextColor(secondaryTextColor)
  doc.setFont('helvetica', 'bold')
  doc.text(`Invoice #${invoiceData.invoiceNumber}`, pageWidth - margin, 45, { align: "right" })
  doc.setFont('helvetica', 'normal')
  doc.text(`Issue Date: ${format(new Date(invoiceData.issueDate), "MMM d, yyyy")}`, pageWidth - margin, 50, { align: "right" })
  doc.text(`Due Date: ${format(new Date(invoiceData.dueDate), "MMM d, yyyy")}`, pageWidth - margin, 55, { align: "right" })

  // Client Info
  doc.setFontSize(14)
  doc.setTextColor(textColor)
  doc.setFont('helvetica', 'bold')
  doc.text("Bill To:", margin, 90)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(secondaryTextColor)
  doc.text(client.fullName, margin, 100)
  doc.text(client.email || "", margin, 105)

  // Service Period
  doc.setFontSize(14)
  doc.setTextColor(textColor)
  doc.setFont('helvetica', 'bold')
  doc.text("Service Period:", margin, 120)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(secondaryTextColor)
  doc.text(
    `${format(new Date(invoiceData.issueDate), "MMM d, yyyy")} - ${format(new Date(invoiceData.dueDate), "MMM d, yyyy")}`,
    margin,
    130
  )

  // Table
  const tableTop = 150
  const tableLeft = margin
  const colWidths: [number, number, number, number] = [80, 30, 30, 30]
  let yPos = tableTop

  // Table Header
  doc.setFillColor(243, 244, 246)
  doc.rect(tableLeft, yPos - 10, contentWidth, 10, "F")
  doc.setFontSize(10)
  doc.setTextColor(textColor)
  doc.setFont('helvetica', 'bold')
  doc.text("Description", tableLeft + 5, yPos - 3)
  doc.text("Quantity", tableLeft + colWidths[0] + 5, yPos - 3, { align: "right" })
  doc.text("Rate", tableLeft + colWidths[0] + colWidths[1] + 5, yPos - 3, { align: "right" })
  doc.text("Amount", tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos - 3, { align: "right" })
  doc.setFont('helvetica', 'normal')

  // Table Content
  doc.setFontSize(10)
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

  doc.setTextColor(textColor)
  doc.setFont('helvetica', 'bold')
  doc.text("Subtotal:", totalsX, yPos + 6)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${subtotal.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
    align: "right",
  })

  yPos += 10

  if (invoiceData.taxEnabled && invoiceData.taxRate != null) {
    doc.setFont('helvetica', 'bold')
    doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, yPos + 6)
    doc.setFont('helvetica', 'normal')
    doc.text(`$${tax.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
      align: "right",
    })
    yPos += 10
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text("Total:", totalsX, yPos + 6)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${total.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPos + 6, {
    align: "right",
  })

  // Add notes if any
  if (invoiceData.notes) {
    yPos += 20
    doc.setFontSize(14)
    doc.setTextColor(textColor)
    doc.setFont('helvetica', 'bold')
    doc.text("Notes:", margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.setTextColor(secondaryTextColor)
    const splitNotes = doc.splitTextToSize(invoiceData.notes, contentWidth)
    doc.text(splitNotes, margin, yPos + 10)
  }

  // Add footer
  doc.setFontSize(10)
  doc.setTextColor(secondaryTextColor)
  doc.setFont('helvetica', 'bold')
  doc.text(
    `Payment is due by ${format(new Date(invoiceData.dueDate), "MMM d, yyyy")}`,
    pageWidth / 2,
    285,
    { align: "center" }
  )

  return doc
}
