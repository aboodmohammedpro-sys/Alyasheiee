# 13. Form Design & Validation Strategy

This document details the standards, validation architectures, and interaction designs for data-entry forms using **React Hook Form** and **Zod**.

---

## 1. Unified Form Stack

All system forms leverage a standardized library configuration to guarantee consistency in error handling, field focus, and validation:

```
[User Input Fields] ──> [React Hook Form] ──> [Zod Schema Validation]
                                                   │
                                            Is payload valid?
                                            /               \
                                        (Yes)               (No)
                                        /                       \
                         [Submit to Laravel API]      [Map errors back to fields]
```

- **Uncontrolled Inputs**: Fields are rendered as uncontrolled components (`register` or `<Controller />` wrappers) to prevent keyboard delays on dense forms.
- **Validation Trigger**: Validation runs on blur (`mode: 'onBlur'`) for text/numeric fields, and onChange for dynamic dropdowns (select boxes, comboboxes).

---

## 2. Standard Layout & Visual Feedback
Each form follows a structured template:

- **Labels & Descriptions**: Inputs must include clear, visible `<label>` tags. Placeholders must display example formatting (e.g. `e.g. PR-2026-0001`).
- **Required Fields**: Indicated with a red asterisk `*` placed after the label.
- **Error Indicators**:
  - Input border changes to Destructive Red (`border-destructive`).
  - An error message is displayed directly below the field in red text (`text-xs text-destructive`).
  - Screen reader attributes (`aria-invalid="true"`, `aria-describedby="field-error-id"`) are injected dynamically.

---

## 3. Dynamic Sub-Forms (Line Items Builder)
ERPs require forms containing dynamic lists of items—such as adding multiple items and quantities to a Purchase Requisition. We implement this using React Hook Form's `useFieldArray`.

```typescript
// Example: Purchasing Requisition Item Grid Form
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const prFormSchema = z.object({
  project_id: z.string().min(1, 'Project selection is required'),
  expected_date: z.string(),
  items: z.array(z.object({
    item_id: z.string().min(1, 'Item selection is required'),
    qty_requested: z.number().min(1, 'Quantity must be at least 1'),
    estimated_cost: z.number().optional(),
  })).min(1, 'At least one item must be requested'),
});

type PRFormValues = z.infer<typeof prFormSchema>;

export function PRForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<PRFormValues>({
    resolver: zodResolver(prFormSchema),
    defaultValues: { items: [{ item_id: '', qty_requested: 1 }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: PRFormValues) => {
    // Send data to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Head Form Details */}
      ...
      {/* Items Dynamic Grid */}
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-center">
          <select {...register(`items.${index}.item_id` as const)} />
          <input type="number" {...register(`items.${index}.qty_requested` as const, { valueAsNumber: true })} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ item_id: '', qty_requested: 1 })}>Add Item</button>
    </form>
  );
}
```

---

## 4. Keyboard Navigation & Input Speed
To optimize data entry speed:
1. **Auto-Focus**: The first input field in any form drawer or page focuses automatically upon loading.
2. **Numeric Keypad Support**: Quantity and meter fields are explicitly set to `inputMode="decimal"` or `type="number"`, opening the numeric pad on mobile/tablet keyboards.
3. **Submit via Keyboard**: Pressing `Ctrl + Enter` (or `Cmd + Enter`) anywhere inside the form triggers the submission pipeline immediately.

---

## 5. Form Dirty States & Safety Guard
To prevent accidental losses of complex input states (e.g. a user writing a long fuel report and accidentally clicking a sidebar menu):
- We listen to React Hook Form's `isDirty` state.
- If `isDirty` is true and the user attempts a route change or page reload, we intercept the event and trigger a confirmation dialog:
  `"You have unsaved changes. Are you sure you want to discard them?"`
- When using drawers (sheets), clicking the backdrop overlay does not close the panel if the form is dirty; users must explicitly click the "Cancel" button or confirm the closure.
