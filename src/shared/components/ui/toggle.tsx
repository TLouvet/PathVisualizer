import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-all aria-invalid:ring-destructive/20 aria-invalid:border-destructive whitespace-nowrap backdrop-blur-xl relative cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-transparent text-white/70 border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/8 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:pointer-events-none after:transition-none hover:text-white hover:border-white/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:before:from-white/12 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0] data-[state=on]:text-white data-[state=on]:border-white/40 data-[state=on]:shadow-[0_8px_24px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.15)_inset] data-[state=on]:before:from-white/20 data-[state=on]:before:to-white/5",
        outline:
          "border border-white/20 bg-transparent text-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/8 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:pointer-events-none after:transition-none hover:text-white hover:border-white/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:before:from-white/12 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0] data-[state=on]:text-white data-[state=on]:border-primary/60 data-[state=on]:shadow-[0_8px_24px_rgba(0,212,255,0.4),0_0_20px_rgba(0,212,255,0.2),0_0_0_1px_rgba(255,255,255,0.2)_inset] data-[state=on]:before:from-white/25 data-[state=on]:before:via-primary/15 data-[state=on]:before:to-primary/5",
      },
      size: {
        default: "h-9 px-2 min-w-9 rounded-xl",
        sm: "h-8 px-1.5 min-w-8 rounded-lg",
        lg: "h-10 px-2.5 min-w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
