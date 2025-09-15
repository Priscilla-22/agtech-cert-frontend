interface PDFExportOptions {
  data: any[]
  filename: string
  title: string
  subtitle?: string
  logo?: string
  customHeaders?: string[]
  customMapping?: (item: any, index: number) => any[]
}

export async function exportToPDF({
  data,
  filename,
  title,
  subtitle = 'PESIRA - Agricultural Technology Certification Platform',
  logo,
  customHeaders,
  customMapping
}: PDFExportOptions) {
  try {
    // Try to import jsPDF and autoTable in a way that works with both default and named exports
    const jsPDFModule = await import('jspdf')
    const JsPDFCtor = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default
    const autoTableModule = await import('jspdf-autotable')
    const autoTable = (autoTableModule as any).default || (autoTableModule as any)

    const doc = new JsPDFCtor()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Determine logo path (fallback to public logo if none provided)
    const logoPath = logo ?? '/pesira-logo-nobg.png'

    // Header styling
    const headerHeight = 60

    // Header background band
    doc.setFillColor(203, 221, 233) // #CBDDE9
    doc.rect(0, 0, pageWidth, headerHeight, 'F')

    // Try to load the logo and embed it
    let logoDataUrl: string | null = null
    try {
      const res = await fetch(logoPath)
      if (res.ok) {
        const blob = await res.blob()
        logoDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
    } catch {
      // Ignore logo loading errors
    }

    // Place logo if loaded
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 20, 12, 28, 28)
    }

    // Branding text
    doc.setFontSize(24)
    doc.setTextColor(31, 52, 8) // Dark green color
    doc.text('PESIRA', 55, 28)

    // Subtitle
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(subtitle, 55, 38)

    // Main title below header
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(title, 20, headerHeight + 18)

    // Date and metadata
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, headerHeight + 28)
    doc.text(`Total Records: ${data.length}`, 20, headerHeight + 34)

    // Divider
    doc.setDrawColor(220, 220, 220)
    doc.line(20, headerHeight + 38, pageWidth - 20, headerHeight + 38)

    // Table start position, respecting header
    const tableStartY = headerHeight + 45

    // Prepare table data
    const defaultHeaders = ['#', 'Name', 'Email', 'Phone', 'County', 'Type', 'Status', 'Date']
    const headers = customHeaders || defaultHeaders

    const tableData = data.map((item, index) => {
      if (customMapping) {
        return customMapping(item, index)
      }

      // Default mapping for farmer data
      return [
        index + 1,
        item.name || 'N/A',
        item.email || 'N/A',
        item.phone || 'N/A',
        item.county || 'N/A',
        item.farmingType || 'N/A',
        item.certificationStatus || item.status || 'N/A',
        item.registrationDate ? new Date(item.registrationDate).toLocaleDateString() : 'N/A'
      ]
    })

    // Add table with professional styling
    autoTable(doc, {
      startY: 85,
      head: [headers],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [203, 221, 233], // #CBDDE9
        textColor: [31, 41, 55], // Dark gray
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Very light gray
      },
      columnStyles: {
        0: { cellWidth: 10 }, // #
        1: { cellWidth: 25 }, // Name
        2: { cellWidth: 35 }, // Email
        3: { cellWidth: 25 }, // Phone
        4: { cellWidth: 20 }, // County
        5: { cellWidth: 20 }, // Type
        6: { cellWidth: 20 }, // Status
        7: { cellWidth: 25 }  // Date
      },
      margin: { top: 85, left: 20, right: 20 },
      didDrawPage: (data: any) => {
        // Add footer
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text('PESIRA - Agricultural Technology Certification', pageWidth / 2, pageHeight - 10, { align: 'center' })

        // Add page number
        doc.text(`Page ${data.pageNumber}`, pageWidth - 30, pageHeight - 10)
      }
    })

    // Save the PDF
    doc.save(filename)
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('PDF export failed. Please ensure jspdf and jspdf-autotable packages are properly installed.')
  }
}

