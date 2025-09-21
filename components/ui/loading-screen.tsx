interface LoadingScreenProps {
  title?: string
  subtitle?: string
  showLogo?: boolean
  className?: string
}

export function LoadingScreen({
  title = "AgTech Certification",
  subtitle = "Loading...",
  showLogo = true,
  className = ""
}: LoadingScreenProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 ${className}`}>
      <div className="text-center space-y-6">
        {/* Logo with heartbeat animation */}
        {showLogo && (
          <div className="animate-heartbeat">
            <img
              src="/pesira-logo-nobg.png"
              alt="AgTech Certification"
              className="w-32 h-32 mx-auto drop-shadow-lg"
            />
          </div>
        )}

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 animate-pulse">{subtitle}</p>
        </div>

        {/* Subtle spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto opacity-60"></div>
      </div>
    </div>
  )
}

export function LoadingSpinner({
  size = "sm",
  className = ""
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]} ${className}`} />
  )
}