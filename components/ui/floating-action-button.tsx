import * as React from "react"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  size?: "default" | "sm" | "lg"
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, icon = <Plus className="w-5 h-5" />, position = "bottom-right", size = "default", ...props }, ref) => {
    const positions = {
      "bottom-right": "fixed bottom-6 right-6",
      "bottom-left": "fixed bottom-6 left-6",
      "top-right": "fixed top-6 right-6",
      "top-left": "fixed top-6 left-6",
    }

    const sizes = {
      default: "w-14 h-14",
      sm: "w-12 h-12",
      lg: "w-16 h-16",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "z-50 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl",
          "hover:shadow-3xl hover:scale-110 transition-all duration-300",
          "border border-primary/20 backdrop-blur-sm",
          "flex items-center justify-center group relative overflow-hidden",
          "focus:outline-none focus:ring-4 focus:ring-primary/30",
          positions[position],
          sizes[size],
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
        </div>
      </button>
    )
  }
)

FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton }