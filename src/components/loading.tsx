import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
  variant?: 'spinner' | 'skeleton-cards' | 'skeleton-list'
}

export function Loading({ 
  message = "Loading...", 
  className,
  size = 'md',
  centered = true,
  variant = 'spinner'
}: LoadingProps) {
  const sizeClasses = {
    'sm': 'h-4 w-4',
    'md': 'h-6 w-6', 
    'lg': 'h-8 w-8'
  }

  const containerClasses = cn(
    "flex items-center gap-2",
    centered && "justify-center py-8",
    className
  )

  if (variant === 'skeleton-cards') {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'skeleton-list') {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default spinner variant
  return (
    <div className={containerClasses}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      <span className="text-muted-foreground">{message}</span>
    </div>
  )
}