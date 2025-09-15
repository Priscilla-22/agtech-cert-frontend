interface CSVExportOptions {
  data: any[]
  filename: string
  title: string
  subtitle?: string
  customHeaders?: string[]
  customMapping?: (item: any, index: number) => any[]
}

export async function exportToCSV({
  data,
  filename,
  title,
  subtitle = 'PESIRA - Agricultural Technology Certification Platform',
  customHeaders,
  customMapping
}: CSVExportOptions) {
  // Prepare headers
  const defaultHeaders = ['#', 'Name', 'Email', 'Phone', 'County', 'Sub County', 'Village', 'Farming Type', 'Total Land Size (Acres)', 'Organic Experience', 'Education Level', 'Certification Status', 'Registration Date', 'Status']
  const headers = customHeaders || defaultHeaders

  // Convert data to CSV format
  const csvData = data.map((item, index) => {
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
      item.subCounty || 'N/A',
      item.village || 'N/A',
      item.farmingType || 'N/A',
      item.totalLandSize || 'N/A',
      item.organicExperience || 'N/A',
      item.educationLevel || 'N/A',
      item.certificationStatus || 'N/A',
      item.registrationDate ? new Date(item.registrationDate).toLocaleDateString() : 'N/A',
      item.status || 'N/A'
    ]
  })

  const csvContent = [
    subtitle,
    title,
    `Generated on: ${new Date().toLocaleString()}`,
    `Total Records: ${data.length}`,
    '',
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}