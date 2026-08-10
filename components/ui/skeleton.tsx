import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // Tinted from the foreground rather than a solid surface token so it
      // stays visible on top of translucent glass in both themes.
      className={cn("animate-pulse rounded-md bg-text-primary/[0.08]", className)}
      {...props}
    />
  )
}

export { Skeleton }
