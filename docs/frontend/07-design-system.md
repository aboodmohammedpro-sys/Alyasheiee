# 07. Design System

This document outlines the Design System, token variables, theme specifications, and color palette for the **Construction ERP System**. The design is built to represent safety, machinery, and precision, using deep slate backgrounds, dark mode supports, and safety-orange and amber accents.

---

## 1. Color Palette (HSL & Theme Tokens)

We define our color system in HSL values to easily compute hover states, opacity variations, and dark/light shifts.

### Color Spectrum
- **Primary (Steel Blue)**: Represents stability, engineering, and professionalism.
- **Accent (Safety Orange/Amber)**: Represents machinery, safety, warning, and industrial actions.
- **Muted Grays (Slate/Zinc)**: Forms the bedrock of our high-density data tables and cards.

```css
:root {
  /* Core Palette (Light Mode) */
  --background: 210 20% 98%;      /* Slate 50 tint */
  --foreground: 224 71.4% 4.1%;   /* Deep slate 950 */

  --card: 0 0% 100%;
  --card-foreground: 224 71.4% 4.1%;

  --popover: 0 0% 100%;
  --popover-foreground: 224 71.4% 4.1%;

  --primary: 215 54% 23%;         /* Dark Industrial Steel Blue */
  --primary-foreground: 210 20% 98%;

  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;

  --accent: 25 95% 53%;           /* Safety Orange */
  --accent-foreground: 0 0% 100%;

  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;

  --destructive: 0 84.2% 60.2%;   /* Danger Red */
  --destructive-foreground: 210 20% 98%;

  --border: 220 13% 91%;          /* Light boundary lines */
  --input: 220 13% 91%;
  --ring: 25 95% 53%;             /* Safety Orange focus outline */
}

.dark {
  /* Core Palette (Dark Mode - Slate Theme) */
  --background: 224 71% 4%;       /* Deep Dark Slate */
  --foreground: 210 20% 98%;

  --card: 224 71% 6%;             /* Slightly elevated card surface */
  --card-foreground: 210 20% 98%;

  --popover: 224 71% 5%;
  --popover-foreground: 210 20% 98%;

  --primary: 210 40% 96%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --accent: 25 95% 53%;           /* Safety Orange stays vibrant */
  --accent-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 25%;
  --input: 217.2 32.6% 25%;
  --ring: 25 95% 53%;
}
```

---

## 2. Typography

We utilize two primary typefaces:

1. **System Interface & Body Content**: `Inter` or `Outfit` (sans-serif)
   - Clean, geometric structure, optimized for high legibility at small sizes.
2. **Numeric Data & Document Identifiers**: `JetBrains Mono` or `Consolas` (monospace)
   - Prevents layout shifting during real-time number calculations.
   - Standardizes text alignment in table column grids.

### Font Size Hierarchy
- **Title (H1)**: `text-2xl font-bold tracking-tight` (24px) - Page Titles.
- **Section (H2)**: `text-lg font-semibold` (18px) - Card Section Headers.
- **Subsection (H3)**: `text-sm font-medium` (14px) - Input group labels.
- **Body / Table Cells**: `text-xs md:text-sm font-normal` (12px/14px) - High-density grids.
- **Caption / Metadata**: `text-xxs text-muted-foreground` (10px) - Timestamp / Creator logs.

---

## 3. Spacing & Borders
Consistency in spacing reduces visual friction when looking at dense UI.

- **Grid Spacing System**:
  - `space-y-4` (16px): Standard gap between vertical content blocks.
  - `gap-6` (24px): Standard gap in card layouts or multi-column forms.
  - `p-4` (16px): Default padding inside cards, table headers, and drawers.
- **Border Radius**:
  - Main Cards: `rounded-xl` (12px) - Soft, modern containers.
  - Input fields / Buttons: `rounded-md` (6px) - Professional, crisp boundaries.
- **Elevation / Shadows**:
  - Flat base look (`shadow-none`) with borders for table elements.
  - Card base: `shadow-sm` (subtle ambient shadow).
  - Dialogs & Command Palette: `shadow-lg` / `shadow-2xl` (high elevation to separate context).
