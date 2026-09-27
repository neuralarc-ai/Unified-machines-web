import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Brutalist controls, ported from um-landing's BRUT/UI button: a 1px ink
 * border and a hard 2px offset shadow; hover lifts 1px out of the shadow,
 * press (or an open popup) sinks into it. The shadow colour is
 * `--btn-shadow` (ink by default), so a button on a dark band can swap it.
 */
const control =
  "border-ink font-semibold shadow-[2px_2px_0_var(--btn-shadow,var(--ink))] transition-[translate,box-shadow,background-color,color] duration-120 ease-out hover:not-disabled:-translate-px hover:not-disabled:shadow-[3px_3px_0_var(--btn-shadow,var(--ink))] active:not-disabled:translate-px active:not-disabled:shadow-none data-pressed:translate-px data-pressed:shadow-none data-popup-open:translate-px data-popup-open:shadow-none"
const quiet = "border-transparent font-semibold hover:border-ink hover:bg-muted"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: cn(control, "bg-primary text-primary-foreground hover:bg-ink-soft"),
        accent: cn(control, "bg-lime text-ink hover:bg-lime-deep"),
        outline: cn(control, "bg-background text-foreground hover:bg-muted aria-expanded:bg-muted"),
        secondary: cn(control, "bg-secondary text-secondary-foreground hover:bg-secondary/85 aria-expanded:bg-secondary"),
        ghost: cn(quiet, "hover:text-foreground aria-expanded:bg-muted"),
        destructive: cn(control, "bg-destructive text-white hover:bg-destructive/90"),
        link: "border-transparent font-semibold text-foreground underline decoration-[3px] underline-offset-4",
      },
      size: {
        default: "h-9 gap-2 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.9rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        // marketing CTA: the icon nudges up-right on hover, on top of the control's lift
        cta: "h-11 gap-3.5 px-4 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5 hover:[&_svg]:-translate-y-px [&_svg:not([class*='size-'])]:size-4.5",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
