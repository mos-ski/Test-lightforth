# Lightforth UI Components

## Primitives (`src/ui/`)

### Button
- **Variants:** `primary`, `secondary`, `ghost`, `danger`
- **Sizes:** `sm`, `md`, `lg`
- **Props:** `variant`, `size`, `leadingIcon`, `loading`, `disabled`
- **Data attributes:** `data-slot="button"`, `data-variant`, `data-size`, `data-loading`

### Badge
- **Variants:** `neutral`, `accent`, `positive`, `warning`, `danger`, `info`
- **Sizes:** `sm`, `md`
- **Props:** `variant`, `size`

### Divider
- **Orientation:** `horizontal`, `vertical`
- **Props:** `orientation`

### TextField
- **Props:** `id`, `label`, `error`, `disabled`
- **Accessibility:** `aria-invalid`, `aria-describedby`, `role="alert"` on error

### SelectField
- **Props:** `id`, `label`, `options`, `error`, `disabled`
- **Uses:** `ChevronDown` from lucide-react

### Dialog (Base UI)
- **Components:** `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogBackdrop`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogClose`
- **Behavior:** Focus trap, Escape to close, backdrop click

### Tabs (Base UI)
- **Components:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Behavior:** Keyboard navigation, aria attributes

### Switch (Base UI)
- **Props:** `label`, `checked`, `onCheckedChange`

### Checkbox (Base UI)
- **Props:** `label`, `checked`, `onCheckedChange`

### RadioGroup (Base UI)
- **Components:** `RadioGroup`, `RadioGroupItem`
- **Props:** `label`, `value`, `onValueChange`

### Tooltip (Base UI)
- **Components:** `Tooltip`, `TooltipTrigger`, `TooltipContent`
- **Props:** `side` (top/bottom/left/right)

### Avatar
- **Sizes:** `xs`, `sm`, `md`, `lg`, `xl`
- **Props:** `src`, `alt`, `name`, `size`
- **Behavior:** Fallback to initials

### Card
- **Props:** `className` (extends div)

### Skeleton
- **Props:** `className` (extends div)
- **Behavior:** `animate-pulse`, `motion-reduce:animate-none`

### Spinner
- **Sizes:** `sm`, `md`, `lg`
- **Props:** `size`

### ProgressBar
- **Props:** `value`, `max`, `label`, `showValue`, `color` (accent/positive/warning/danger)

### SearchInput
- **Props:** `value`, `onClear`, `placeholder`

### EmptyState
- **Props:** `icon`, `title`, `description`, `action`

### StatCard
- **Props:** `label`, `value`, `icon`, `delta` (value + direction)

### Chip
- **Variants:** `default`, `accent`, `positive`, `warning`, `danger`
- **Props:** `variant`, `removable`, `onRemove`

### Breadcrumbs
- **Props:** `items` (label, href, current)

### StepIndicator
- **Props:** `steps` (id, label, status), `orientation` (horizontal/vertical)
- **Statuses:** `complete`, `active`, `pending`

### Toast
- **Exports:** `Toaster`, `toast` (success/error/info/warning/default/dismiss)
- **Uses:** sonner (already installed)

## Form Components

### FormPanel
- **Props:** `title`, `step`, `uploadedFile`, `footer`, `children`

### FormField
- **Props:** `id`, `label`, `error`, `disabled`

### FormTextArea
- **Props:** `id`, `label`, `error`, `disabled`

### FormSelectField
- **Props:** `id`, `label`, `options`, `error`, `disabled`

### FormChoiceGroup
- **Props:** `label`, `name`, `options`, `selected`

### FormPanelFooter
- **Props:** `backHref`, `nextHref`, `nextLabel`, `backLabel`, `nextIcon`

### UploadedFileStrip
- **Props:** `fileName`, `changeHref`

### AiSuggestionAction
- **Props:** `children` (default: "AI Suggestion")

### DocumentDropAction
- **Props:** `label`, `actionLabel`, `hint`, `actionHref`

### ExampleResponseCard
- **Props:** `children`, `helperText`

### PermissionSteps
- **Props:** `steps`, `actionHref`, `previewSrc`, `startHref`, `startLabel`

### ReviewSummaryList
- **Props:** `rows` (id, title, value, icon, href)

### OptionStack
- **Props:** `options` (id, label, href, icon, variant, disabled)

### GoogleAuthButton
- **Props:** `children` (default: "Sign in with Google")

### FormDividerLabel
- **Props:** `children`

### FormLinkButton
- **Variants:** `primary`, `secondary`
- **Props:** `variant`

## Navigation

### ShellBar
- **Props:** `homeHref`, `current`, `closeHref`, `action`, `secondaryAction`

### SideMenu
- **Props:** `items` (label, href, icon, active, dividerBefore), `width`

### SourcePicker
- **Props:** `title`, `actionLabel`, `idleText`, `meta`, `options`, `historyLink`
- **Behavior:** Keyboard navigation (Escape), click outside to close

### DataTable
- **Props:** `title`, `searchValue`, `onSearchChange`, `action`, `columns`, `rows`, `pagination`, `onPageChange`
- **Behavior:** Controlled search, functional pagination

## Layout

### AppShell
- **Props:** `sidebar`, `header`, `children`

### Workspace
- **Props:** `children`

### ContentCard
- **Props:** `compact`, `children`

### Stack
- **Props:** `direction` (column/row), `gap`, `align`, `wrap`

### VisuallyHidden
- **Props:** children (screen-reader-only)

## Barrel Export

All components are exported from `src/ui/index.ts` with their prop types.
