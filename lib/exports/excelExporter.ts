interface ExcelExportOptions {
  data: any[]
  filename: string
  title: string
  subtitle?: string
  sheetName?: string
  customHeaders?: string[]
  customMapping?: (item: any, index: number) => any
}

export async function exportToExcel({
  data,
  filename,
  title,
  subtitle = 'PESIRA - Agricultural Technology Certification Platform',
  sheetName = 'Data',
  customHeaders,
  customMapping
}: ExcelExportOptions) {
  try {
    // Try to import xlsx
    const XLSX = await import('xlsx')

    // Prepare headers
    const defaultHeaders = ['#', 'Name', 'Email', 'Phone', 'County', 'Sub County', 'Village', 'Farming Type', 'Total Land Size (Acres)', 'Organic Experience', 'Education Level', 'Certification Status', 'Registration Date', 'Status']
    const headers = customHeaders || defaultHeaders

    // Prepare data
    const excelData = data.map((item, index) => {
      if (customMapping) {
        const mappedData = customMapping(item, index)
        const dataObject: any = {}
        headers.forEach((header, idx) => {
          dataObject[header] = mappedData[idx] || 'N/A'
        })
        return dataObject
      }

      // Default mapping for farmer data
      return {
        '#': index + 1,
        'Name': item.name || 'N/A',
        'Email': item.email || 'N/A',
        'Phone': item.phone || 'N/A',
        'County': item.county || 'N/A',
        'Sub County': item.subCounty || 'N/A',
        'Village': item.village || 'N/A',
        'Farming Type': item.farmingType || 'N/A',
        'Total Land Size (Acres)': item.totalLandSize || 'N/A',
        'Organic Experience': item.organicExperience || 'N/A',
        'Education Level': item.educationLevel || 'N/A',
        'Certification Status': item.certificationStatus || 'N/A',
        'Registration Date': item.registrationDate ? new Date(item.registrationDate).toLocaleDateString() : 'N/A',
        'Status': item.status || 'N/A'
      }
    })

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Add title and subtitle as header rows
    const titleRow = [title]
    const subtitleRow = [subtitle]
    const metaRow = [`Generated on: ${new Date().toLocaleString()}`, '', `Total Records: ${data.length}`]
    const emptyRow = ['']

    // Insert header rows at the beginning
    XLSX.utils.sheet_add_aoa(ws, [titleRow, subtitleRow, metaRow, emptyRow], { origin: 'A1' })
    XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A5', skipHeader: false })

    // Style the worksheet (basic styling)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')

    // Set column widths
    ws['!cols'] = [
      { width: 8 },   // #
      { width: 20 },  // Name
      { width: 25 },  // Email
      { width: 15 },  // Phone
      { width: 15 },  // County
      { width: 15 },  // Sub County
      { width: 15 },  // Village
      { width: 18 },  // Farming Type
      { width: 20 },  // Land Size
      { width: 18 },  // Experience
      { width: 15 },  // Education
      { width: 18 },  // Certification
      { width: 15 },  // Date
      { width: 12 }   // Status
    ]

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Save the file
    XLSX.writeFile(wb, filename)
  } catch (error) {
    console.error('Excel export failed:', error)
    throw new Error('Excel export failed. Please ensure xlsx package is properly installed.')
  }
}

