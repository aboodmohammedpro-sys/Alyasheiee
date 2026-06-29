# 19. Animation Strategy

This document defines the animation and transition guidelines for the system using **Framer Motion**. Animations are used to improve context retention, provide visual feedback, and smooth out loading states.

---

## 1. Principles of Enterprise Animation

- **Functional, Not Decorative**: Every animation must serve a purpose (e.g., indicating a state change, showing container expansion, guiding focus). Flashy animations that delay user interaction are prohibited.
- **Speed Constraints**:
  - **Quick feedback (e.g., hover states, tooltips)**: `100ms - 150ms` (spring or easeOut).
  - **Intermediate transitions (e.g., accordion toggle, drawer slide)**: `200ms - 250ms` (easeInOut).
  - **Major transitions (e.g., page navigation, modal entry)**: `300ms` (easeOut).
- **Reduced Motion Support**:
  - Users with OS-level "Reduce Motion" enabled will automatically bypass transitions. We wrap custom animations in a media query check: `@media (prefers-reduced-motion: reduce)`.

---

## 2. Skeleton Screens & Loading States

To minimize perceived wait times during API data fetching, we replace loading spinners with **Skeleton Screens** matching the expected content layout.

```
       [ Loading States Transition ]
  ┌─────────────────────────────────────┐
  │ 1. Initial Load: Skeleton Grid      │ ─── Pulse animation (opacity 0.5 to 1)
  ├─────────────────────────────────────┤
  │ 2. Data Returns: Fade-in Content    │ ─── Framer Motion layout transition
  └─────────────────────────────────────┘
```

- **Table Skeletons**: A mock table container displaying shimmering grey bars in place of text cells, keeping column widths intact.
- **Card Skeletons**: Pre-sized grey blocks for dashboard widgets.
- **Implementation (Tailwind CSS)**:
  ```tsx
  export function TableSkeleton() {
    return (
      <div className="w-full animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-muted/60 rounded-md w-full" />
          ))}
        </div>
      </div>
    );
  }
  ```

---

## 3. Key Transition Configurations

### 3.1 Right Drawer Slide-In
```typescript
export const drawerVariants = {
  hidden: { x: '100%', opacity: 0.9 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', damping: 25, stiffness: 220 } 
  },
  exit: { 
    x: '100%', 
    opacity: 0.9,
    transition: { type: 'tween', duration: 0.2, ease: 'easeIn' } 
  }
};
```

### 3.2 Layout Morphing (Shared Elements)
When clicking a project item in a card layout to open details, we use Framer Motion's `layoutId` to morph the card container into the header of the details page, maintaining continuity.

```tsx
// card.tsx
<motion.div layoutId={`project-container-${project.id}`}>
  <motion.h3 layoutId={`project-title-${project.id}`}>{project.name}</motion.h3>
</motion.div>

// details-page.tsx
<motion.div layoutId={`project-container-${project.id}`}>
  <motion.h1 layoutId={`project-title-${project.id}`}>{project.name}</motion.h1>
</motion.div>
```

### 3.3 Micro-interactions
- **Success checkmarks**: Scales up with elastic spring back (`scale: [0.8, 1.2, 1]`) when an action (like PO creation) completes.
- **Save status indicator**: Subtle fade-in of "Draft Saved" text in the form footer.
- **Notification bell**: A subtle tilt oscillation animation when new critical notifications arrive.
