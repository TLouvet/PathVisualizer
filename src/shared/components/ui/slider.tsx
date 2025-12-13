import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/shared/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.1)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-b before:from-white/8 before:to-transparent before:pointer-events-none"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-linear-to-r from-primary to-secondary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full shadow-[0_2px_8px_rgba(0,212,255,0.3)]"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-4.5 shrink-0 rounded-full border-2 border-white/30 bg-linear-to-br from-primary to-secondary shadow-[0_2px_8px_rgba(0,212,255,0.3)] transition-all hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,212,255,0.5)] focus-visible:scale-110 focus-visible:shadow-[0_4px_12px_rgba(0,212,255,0.5)] focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
