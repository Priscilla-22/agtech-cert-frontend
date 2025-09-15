import { Badge } from "@/components/ui/badge"
import { Leaf, Award, Calendar, Building2, User } from "lucide-react"
import type { Certificate } from "@/lib/types"

interface CertificatePreviewProps {
  certificate: Certificate
}

export function CertificatePreview({ certificate }: CertificatePreviewProps) {
  return (
    <div className="bg-white border-2 border-primary/20 rounded-lg p-8 space-y-6 shadow-lg">
      <div className="text-center border-b border-primary/20 pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Organic Certification</h1>
            <p className="text-sm text-muted-foreground">Certification Authority</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">ORGANIC CERTIFICATION</h2>
        <p className="text-sm text-muted-foreground">This certifies that the farm operation listed below</p>
        <p className="text-sm text-muted-foreground">has been inspected and meets organic standards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Farmer</p>
              <p className="font-semibold">{certificate.farmerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Farm Operation</p>
              <p className="font-semibold">{certificate.farmName}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Certificate Number</p>
              <p className="font-mono font-semibold">{certificate.certificateNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Valid Period</p>
              <p className="font-semibold">
                {new Date(certificate.issueDate).toLocaleDateString()} -{" "}
                {new Date(certificate.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/20 pt-6">
        <h3 className="font-semibold mb-3">Certified Organic Products:</h3>
        <div className="flex flex-wrap gap-2">
          {certificate.cropTypes.map((crop) => (
            <Badge key={crop} variant="secondary" className="bg-primary/10 text-primary">
              {crop}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t border-primary/20 pt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">CERTIFIED ORGANIC</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This certificate is valid until {new Date(certificate.expiryDate).toLocaleDateString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Issued by Organic Certification Authority</p>
      </div>

      <div className="border-t border-primary/20 pt-4">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Certificate ID: {certificate.id}</span>
          <span>Status: {certificate.status.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}
