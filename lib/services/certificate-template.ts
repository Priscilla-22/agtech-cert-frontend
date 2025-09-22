import { Certificate } from '@/lib/types/certificate'

export const generateCertificateHTML = (certificate: Certificate): string => {
  const cropTypesDisplay = Array.isArray(certificate.cropTypes)
    ? certificate.cropTypes.join(', ')
    : certificate.cropTypes || '-'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .certificate {
          background: white;
          padding: 60px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          color: #2c5530;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .subtitle {
          color: #4a7c59;
          font-size: 18px;
          margin-bottom: 40px;
        }
        .content {
          text-align: left;
          margin: 40px 0;
        }
        .field {
          margin: 15px 0;
          padding: 10px;
          background: #f8f9fa;
          border-left: 4px solid #2c5530;
        }
        .field-label {
          font-weight: bold;
          color: #2c5530;
          display: inline-block;
          width: 150px;
        }
        .field-value {
          color: #333;
        }
        .footer {
          margin-top: 50px;
          color: #666;
          font-size: 14px;
        }
        .seal {
          width: 80px;
          height: 80px;
          border: 3px solid #2c5530;
          border-radius: 50%;
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f8f0;
          font-weight: bold;
          color: #2c5530;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <h1 class="header">🌿 Organic Certification</h1>
        <p class="subtitle">This certifies that the following farm meets organic standards</p>

        <div class="seal">CERTIFIED</div>

        <div class="content">
          <div class="field">
            <span class="field-label">Certificate #:</span>
            <span class="field-value">${certificate.certificateNumber || '-'}</span>
          </div>

          <div class="field">
            <span class="field-label">Farmer Name:</span>
            <span class="field-value">${certificate.farmerName || '-'}</span>
          </div>

          <div class="field">
            <span class="field-label">Farm Name:</span>
            <span class="field-value">${certificate.farmName || '-'}</span>
          </div>

          <div class="field">
            <span class="field-label">Issue Date:</span>
            <span class="field-value">${certificate.issueDate || '-'}</span>
          </div>

          <div class="field">
            <span class="field-label">Expiry Date:</span>
            <span class="field-value">${certificate.expiryDate || '-'}</span>
          </div>

          <div class="field">
            <span class="field-label">Certified Crops:</span>
            <span class="field-value">${cropTypesDisplay}</span>
          </div>
        </div>

        <div class="footer">
          <p>This certificate is valid until the expiry date shown above.</p>
          <p>Issued by: Pesira Organic Certification Authority</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}