"use client"

import * as React from "react"
import {
  Controller,
  type ControllerFieldState,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

/** Spread onto the control so label, description and error are wired for assistive tech */
export type FormControlProps = {
  id: string
  "aria-invalid": boolean
  "aria-describedby"?: string
}

/**
 * react-hook-form ↔ Field. Renders label, description and the animated
 * FieldError, sets `data-invalid` (red label + one shake) and hands the
 * control everything it needs:
 *
 * ```tsx
 * <FormField control={form.control} name="email" label="อีเมล"
 *   render={({ field, control }) => <Input type="email" {...field} {...control} />} />
 * ```
 *
 * Validation timing is RHF's default: errors appear on submit, then update
 * as the user types. Focus moves to the first invalid field on submit.
 */
function FormField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
  // the schema's output type when a resolver transforms values (e.g. zod `.transform`)
  TTransformed = TValues,
>({
  label,
  description,
  orientation,
  className,
  render,
  ...controller
}: Omit<ControllerProps<TValues, TName, TTransformed>, "render"> & {
  label?: React.ReactNode
  description?: React.ReactNode
  orientation?: React.ComponentProps<typeof Field>["orientation"]
  className?: string
  render: (props: {
    field: ControllerRenderProps<TValues, TName>
    fieldState: ControllerFieldState
    control: FormControlProps
  }) => React.ReactElement
}) {
  const id = React.useId()
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => {
        const describedBy = [description && descriptionId, fieldState.error && errorId].filter(Boolean).join(" ")
        return (
          <Field data-invalid={fieldState.invalid} orientation={orientation} className={className}>
            {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
            {render({
              field,
              fieldState,
              control: { id, "aria-invalid": fieldState.invalid, "aria-describedby": describedBy || undefined },
            })}
            {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
            <FieldError id={errorId}>{fieldState.error?.message}</FieldError>
          </Field>
        )
      }}
    />
  )
}

export { FormField }
