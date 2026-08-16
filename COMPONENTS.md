# Lightforth UI Components

All components live in `src/ui/`, are exported from `src/ui/index.ts`, and follow the design token system.

## Primitives

| Component | File | Variants / Sizes | Key Props |
|---|---|---|---|
| **Button** | `button.tsx` | `primary`, `secondary`, `ghost`, `danger` / `sm`, `md`, `lg` | `variant`, `size`, `leadingIcon`, `loading`, `disabled` |
| **Badge** | `badge.tsx` | `neutral`, `accent`, `positive`, `warning`, `danger`, `info` / `sm`, `md` | `variant`, `size` |
| **Chip** | `chip.tsx` | `default`, `accent`, `positive`, `warning`, `danger` | `variant`, `removable`, `onRemove` |
| **Divider** | `divider.tsx` | `horizontal`, `vertical` | `orientation` |
| **Avatar** | `avatar.tsx` | `xs`, `sm`, `md`, `lg`, `xl` | `src`, `alt`, `name`, `size` |
| **Card** | `card.tsx` | — | `className` (extends div) |
| **EmptyState** | `empty-state.tsx` | — | `icon`, `title`, `description`, `action` |
| **StatCard** | `stat-card.tsx` | — | `label`, `value`, `icon`, `delta` |
| **Skeleton** | `skeleton.tsx` | — | `className` |
| **Spinner** | `spinner.tsx` | `sm`, `md`, `lg` | `size` |
| **ProgressBar** | `progress-bar.tsx` | accent/positive/warning/danger | `value`, `max`, `label`, `showValue`, `color` |
| **SearchInput** | `search-input.tsx` | — | `value`, `onClear`, `placeholder` |
| **Tooltip** | `tooltip.tsx` | — | `side` (top/bottom/left/right) |
| **Breadcrumbs** | `breadcrumbs.tsx` | — | `items` (label, href, current) |
| **StepIndicator** | `step-indicator.tsx` | horizontal/vertical | `steps` (id, label, status) |
| **ContentCard** | `content-card.tsx` | — | `compact`, `children` |
| **Stack** | `stack.tsx` | column/row | `direction`, `gap`, `align`, `wrap` |
| **VisuallyHidden** | `visually-hidden.tsx` | — | `children` |

## Base UI Primitives

| Component | File | Components | Behavior |
|---|---|---|---|
| **Dialog** | `dialog.tsx` | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogBackdrop`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogClose` | Focus trap, Escape to close, backdrop click |
| **Tabs** | `tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Keyboard navigation, aria attributes |
| **Switch** | `switch.tsx` | — | `label`, `checked`, `onCheckedChange` |
| **Checkbox** | `checkbox.tsx` | — | `label`, `checked`, `onCheckedChange` |
| **RadioGroup** | `radio-group.tsx` | `RadioGroup`, `RadioGroupItem` | `label`, `value`, `onValueChange` |
| **Menu** | `menu.tsx` | `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuSeparator` | Keyboard navigation, focus management |
| **Toast** | `toast.tsx` | `Toast`, `Toaster`, `toast` | sonner-based, success/error/info/warning |

## Form Components

| Component | File | Key Props |
|---|---|---|
| **TextField** | `text-field.tsx` | `id`, `label`, `error`, `disabled` |
| **SelectField** | `select-field.tsx` | `id`, `label`, `options`, `error`, `disabled` |
| **FormPanel** | `form-panel.tsx` | `title`, `step`, `uploadedFile`, `footer`, `children` |
| **FormField** | `form-panel.tsx` | `id`, `label`, `error`, `disabled` |
| **FormTextArea** | `form-panel.tsx` | `id`, `label`, `error`, `disabled` |
| **FormSelectField** | `form-panel.tsx` | `id`, `label`, `options`, `error`, `disabled` |
| **FormChoiceGroup** | `form-panel.tsx` | `label`, `name`, `options`, `selected` |
| **FormPanelFooter** | `form-panel.tsx` | `backHref`, `nextHref`, `nextLabel`, `backLabel`, `nextIcon` |
| **UploadedFileStrip** | `form-panel.tsx` | `fileName`, `changeHref` |
| **AiSuggestionAction** | `form-panel.tsx` | `children` (default: "AI Suggestion") |
| **DocumentDropAction** | `form-panel.tsx` | `label`, `actionLabel`, `hint`, `actionHref` |
| **ExampleResponseCard** | `form-panel.tsx` | `children`, `helperText` |
| **PermissionSteps** | `form-panel.tsx` | `steps`, `actionHref`, `previewSrc`, `startHref`, `startLabel` |
| **ReviewSummaryList** | `form-panel.tsx` | `rows` (id, title, value, icon, href, details) |
| **OptionStack** | `form-panel.tsx` | `options` (id, label, href, icon, variant, disabled) |
| **GoogleAuthButton** | `form-panel.tsx` | `children` (default: "Sign in with Google") |
| **FormDividerLabel** | `form-panel.tsx` | `children` |
| **FormLinkButton** | `form-panel.tsx` | `variant` (primary, secondary) |

## Navigation

| Component | File | Key Props |
|---|---|---|
| **ShellBar** | `shell-bar.tsx` | `homeHref`, `current`, `parent`, `closeHref`, `action`, `secondaryAction` |
| **SideMenu** | `side-menu.tsx` | `items` (label, href, icon, active, dividerBefore), `width` |
| **SourcePicker** | `source-picker.tsx` | `title`, `options`, `historyLink` |

## Data Display

| Component | File | Key Props |
|---|---|---|
| **DataTable** | `data-table.tsx` | `title`, `searchLabel`, `action`, `columns`, `rows`, `itemLabel`, `selectable`, `minTableWidthClassName`, `onRowClick` |
| **ListPickerDialog** | `list-picker-dialog.tsx` | `open`, `onOpenChange`, `title`, `description`, `items`, `emptyLabel`, `icon`, `onSelect` |
| **CreditCard** | `credit-card.tsx` | `remaining`, `total`, `resetDate`, `bonusHref`, `detailsHref` |

## Layout

| Component | File | Key Props |
|---|---|---|
| **AppShell** | `app-shell.tsx` | `sidebar`, `header`, `children` |
| **Workspace** | `workspace.tsx` | `children`, `className` |
| **BrandMark** | `brand-mark.tsx` | `LightforthAiIcon`, `LightforthMark` |

## Utilities

| Export | File | Purpose |
|---|---|---|
| **cn** | `cn.ts` | clsx + tailwind-merge class merger |
