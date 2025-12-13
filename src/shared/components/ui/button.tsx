import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-4 aria-invalid:ring-destructive/20 aria-invalid:border-destructive backdrop-blur-xl relative cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-transparent text-white border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.15)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:pointer-events-none after:transition-none hover:border-white/30 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:before:from-white/15 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0]",
        destructive:
          "bg-transparent text-destructive border border-destructive/40 shadow-[0_4px_12px_rgba(239,68,68,0.15)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-destructive/10 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-destructive/30 after:to-transparent after:pointer-events-none after:transition-none hover:border-destructive/60 hover:shadow-[0_6px_16px_rgba(239,68,68,0.25),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:before:from-destructive/15 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0]",
        outline:
          "border border-white/20 bg-transparent shadow-[0_2px_8px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/8 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:pointer-events-none after:transition-none hover:border-white/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:before:from-white/12 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0]",
        secondary:
          "bg-transparent text-white border border-secondary/40 shadow-[0_4px_12px_rgba(168,85,247,0.15)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-secondary/10 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-secondary/30 after:to-transparent after:pointer-events-none after:transition-none hover:border-secondary/60 hover:shadow-[0_6px_16px_rgba(168,85,247,0.25),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:before:from-secondary/15 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0]",
        ghost:
          "hover:bg-transparent hover:text-white before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-transparent before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[length:200%_100%] after:bg-[position:-100%_0] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:pointer-events-none after:transition-none hover:before:from-white/8 hover:after:opacity-100 hover:after:transition-[background-position,opacity] hover:after:duration-[1200ms] hover:after:ease-out hover:after:bg-[position:200%_0]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 rounded-xl",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 rounded-lg",
        lg: "h-10 px-6 has-[>svg]:px-4 rounded-xl",
        icon: "size-9 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
