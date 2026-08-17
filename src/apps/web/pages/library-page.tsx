import { Component, type ErrorInfo, type ReactNode, useState } from 'react'
import {
  Download,
  FileText,
  Sparkles,
  Upload,
  ChevronRight,
  Menu,
  Settings,
  Home,
  BarChart3,
} from 'lucide-react'

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  DataTable,
  Divider,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPopup,
  EmptyState,
  Menu as DropdownMenu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Navigator,
  NavigatorGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ProgressBar,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  SearchInput,
  SelectField,
  Separator,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
  Skeleton,
  Slider,
  Spinner,
  StatCard,
  StepIndicator,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TextField,
  ThemeSwitch,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  toast,
  Toaster,
} from '@/ui'
import type {
  DataTableColumn,
  NavigatorItem,
  StepItem,
} from '@/ui'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-canvas p-10 text-danger">
          <h1 className="text-2xl font-bold">Runtime Error</h1>
          <pre className="mt-4 whitespace-pre-wrap text-sm">{this.state.error.message}</pre>
          <pre className="mt-2 text-xs text-ink-muted">{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function Section({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  return (
    <section className="grid min-w-0 gap-4">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="min-w-0 rounded-panel border border-border bg-surface p-6 shadow-panel">{children}</div>
    </section>
  )
}

function Row({ children, label }: { readonly children: React.ReactNode; readonly label?: string }) {
  return (
    <div className="grid gap-2">
      {label ? <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const selectOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Premium', value: 'premium' },
]

type DemoRow = { readonly id: string; readonly name: string; readonly role: string; readonly status: string }
const demoRows: readonly DemoRow[] = [
  { id: '1', name: 'Sarah Chen', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Marcus Johnson', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Priya Patel', role: 'Viewer', status: 'Inactive' },
]

const demoColumns: readonly DataTableColumn<DemoRow>[] = [
  { key: 'name', label: 'Name', render: (r) => r.name },
  { key: 'role', label: 'Role', render: (r) => r.role },
  { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Active' ? 'positive' : 'neutral'} size="sm">{r.status}</Badge> },
]

const stepItems: readonly StepItem[] = [
  { id: '1', label: 'Upload', status: 'complete' },
  { id: '2', label: 'Configure', status: 'active' },
  { id: '3', label: 'Review', status: 'pending' },
]

export function LibraryPage() {
  return (
    <ErrorBoundary>
      <LibraryPageInner />
    </ErrorBoundary>
  )
}

function LibraryPageInner() {
  const [switchOn, setSwitchOn] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('pro')
  const [searchValue, setSearchValue] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState([40])
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <Toaster />
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Design System</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Lightforth Component Library</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
            Every UI primitive, its variants, and all states. Use this as the reference for building screens.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Colors */}
          <Section title="Colors">
            <div className="grid gap-4">
              <Row label="Surface">
                <div className="size-12 rounded-lg bg-canvas border border-border" title="canvas" />
                <div className="size-12 rounded-lg bg-surface border border-border" title="surface" />
                <div className="size-12 rounded-lg bg-surface-raised border border-border" title="surface-raised" />
                <div className="size-12 rounded-lg bg-surface-subtle border border-border" title="surface-subtle" />
              </Row>
              <Row label="Accent">
                <div className="size-12 rounded-lg bg-accent" title="accent" />
                <div className="size-12 rounded-lg bg-accent-hover" title="accent-hover" />
                <div className="size-12 rounded-lg bg-accent-subtle border border-border" title="accent-subtle" />
              </Row>
              <Row label="Status">
                <div className="size-12 rounded-lg bg-positive" title="positive" />
                <div className="size-12 rounded-lg bg-positive-surface border border-border" />
                <div className="size-12 rounded-lg bg-warning" title="warning" />
                <div className="size-12 rounded-lg bg-warning-surface border border-border" />
                <div className="size-12 rounded-lg bg-danger" title="danger" />
                <div className="size-12 rounded-lg bg-danger-surface border border-border" />
              </Row>
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div className="grid gap-3">
              <p className="text-4xl font-bold">text-4xl — Display</p>
              <p className="text-3xl font-bold">text-3xl — Page title</p>
              <p className="text-2xl font-bold">text-2xl — Section title</p>
              <p className="text-xl font-semibold">text-xl — Card title</p>
              <p className="text-lg font-semibold">text-lg — Subsection</p>
              <p className="text-base">text-base — Body</p>
              <p className="text-sm">text-sm — Small body</p>
              <p className="text-xs">text-xs — Caption</p>
            </div>
          </Section>

          {/* Button */}
          <Section title="Button">
            <div className="grid gap-4">
              <Row label="Variants">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </Row>
              <Row label="Sizes">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Row>
              <Row label="With icon">
                <Button leadingIcon={<Download />}>Download</Button>
                <Button variant="secondary" leadingIcon={<Upload />}>Upload</Button>
              </Row>
              <Row label="States">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </Row>
            </div>
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <div className="grid gap-4">
              <Row label="Variants">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="positive">Positive</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </Row>
              <Row label="Sizes">
                <Badge variant="accent" size="sm">Small</Badge>
                <Badge variant="accent" size="md">Medium</Badge>
              </Row>
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <Row label="Sizes">
              <Avatar name="SC" size="xs" />
              <Avatar name="SC" size="sm" />
              <Avatar name="SC" size="md" />
              <Avatar name="SC" size="lg" />
              <Avatar name="SC" size="xl" />
            </Row>
          </Section>

          {/* Chip */}
          <Section title="Chip">
            <Row>
              <Chip variant="default">Default</Chip>
              <Chip variant="accent">Accent</Chip>
              <Chip variant="positive">Positive</Chip>
              <Chip variant="warning">Warning</Chip>
              <Chip variant="danger">Danger</Chip>
            </Row>
          </Section>

          {/* Divider */}
          <Section title="Divider">
            <Divider />
          </Section>

          {/* Card */}
          <Section title="Card">
            <Card className="p-4">
              <p className="text-sm font-semibold text-ink">Card title</p>
              <p className="mt-1 text-sm text-ink-muted">Card content goes here.</p>
            </Card>
          </Section>

          {/* StatCard */}
          <Section title="StatCard">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Credits" value="247" icon={<Sparkles />} />
              <StatCard label="Resumes" value="12" delta={{ value: 8, direction: 'up' }} />
              <StatCard label="Interviews" value="5" delta={{ value: 3, direction: 'down' }} />
            </div>
          </Section>

          {/* ProgressBar */}
          <Section title="ProgressBar">
            <div className="grid gap-4">
              <ProgressBar value={72} label="Credits used" showValue color="accent" />
              <ProgressBar value={90} label="Almost full" showValue color="warning" />
              <ProgressBar value={100} label="Complete" showValue color="positive" />
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="grid gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Section>

          {/* Spinner */}
          <Section title="Spinner">
            <Row>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </Row>
          </Section>

          {/* StepIndicator */}
          <Section title="StepIndicator">
            <StepIndicator steps={stepItems} />
          </Section>

          {/* Breadcrumbs */}
          <Section title="Breadcrumbs">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/v3' },
                { label: 'Documents', href: '/v3/documents' },
                { label: 'Add', current: true },
              ]}
            />
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="chat">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
              </TabsList>
              <TabsContent value="chat">
                <p className="p-4 text-sm text-ink-muted">Chat panel content.</p>
              </TabsContent>
              <TabsContent value="create">
                <p className="p-4 text-sm text-ink-muted">Create panel content.</p>
              </TabsContent>
              <TabsContent value="template">
                <p className="p-4 text-sm text-ink-muted">Template gallery content.</p>
              </TabsContent>
            </Tabs>
          </Section>

          {/* Form Controls */}
          <Section title="Form Controls">
            <div className="grid gap-4">
              <Row label="Text field">
                <div className="w-72">
                  <TextField id="demo-name" label="Full name" placeholder="Enter your name" />
                </div>
              </Row>
              <Row label="Text field with error">
                <div className="w-72">
                  <TextField id="demo-email" label="Email" error="Please enter a valid email address" />
                </div>
              </Row>
              <Row label="Select field">
                <div className="w-72">
                  <SelectField id="demo-plan" label="Plan" options={selectOptions} />
                </div>
              </Row>
              <Row label="Search input">
                <div className="w-72">
                  <SearchInput value={searchValue} onClear={() => setSearchValue('')} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search components..." />
                </div>
              </Row>
              <Row label="Switch">
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} label="Enable notifications" />
              </Row>
              <Row label="Checkbox">
                <Checkbox checked={checkboxChecked} onCheckedChange={(v) => setCheckboxChecked(v === true)} label="I agree to the terms" />
              </Row>
              <Row label="Radio group">
                <RadioGroup value={radioValue} onValueChange={setRadioValue} label="Select plan">
                  <RadioGroupItem value="starter" itemLabel="Starter" />
                  <RadioGroupItem value="pro" itemLabel="Pro" />
                  <RadioGroupItem value="premium" itemLabel="Premium" />
                </RadioGroup>
              </Row>
            </div>
          </Section>

          {/* Tooltip */}
          <Section title="Tooltip">
            <Tooltip>
              <TooltipTrigger render={<Button variant="secondary">Hover me</Button>} />
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </Section>

          {/* Dialog */}
          <Section title="Dialog">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogPopup>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to proceed?
                </DialogDescription>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setDialogOpen(false); toast.success('Confirmed!') }}>Confirm</Button>
                </div>
                <DialogClose />
              </DialogPopup>
            </Dialog>
          </Section>

          {/* Toast */}
          <Section title="Toast">
            <Row>
              <Button variant="secondary" onClick={() => toast.success('Success!')}>Success</Button>
              <Button variant="secondary" onClick={() => toast.error('Error occurred')}>Error</Button>
              <Button variant="secondary" onClick={() => toast.info('Info')}>Info</Button>
              <Button variant="secondary" onClick={() => toast.warning('Warning!')}>Warning</Button>
            </Row>
          </Section>

          {/* DataTable */}
          <Section title="DataTable">
            <DataTable
              title="Users"
              columns={demoColumns}
              rows={demoRows}
              itemLabel={(r) => r.name}
              pagination={{ page: 1, totalPages: 3, totalItems: 25, pageSize: 10 }}
              onPageChange={() => {}}
            />
          </Section>

          {/* EmptyState */}
          <Section title="EmptyState">
            <EmptyState
              icon={<FileText />}
              title="No documents yet"
              description="Add context documents to help AI understand your background."
              action={<Button>Add Document</Button>}
            />
          </Section>

          {/* ThemeSwitch */}
          <Section title="ThemeSwitch">
            <Row label="Toggle theme">
              <ThemeSwitch />
              <ThemeSwitch size="sm" />
            </Row>
          </Section>

          {/* Separator */}
          <Section title="Separator">
            <div className="grid gap-4">
              <p className="text-sm text-ink-muted">Content above</p>
              <Separator />
              <p className="text-sm text-ink-muted">Content below</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-ink-muted">Left</span>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-ink-muted">Right</span>
              </div>
            </div>
          </Section>

          {/* Slider */}
          <Section title="Slider">
            <div className="grid gap-6">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                min={0}
                max={100}
                label="Volume"
                showValue
              />
              <Slider
                defaultValue={[50]}
                min={0}
                max={100}
                label="Price range"
                minLabel="$0"
                maxLabel="$100"
              />
            </div>
          </Section>

          {/* Accordion */}
          <Section title="Accordion">
            <Accordion defaultValue={['item-1']}>
              <AccordionItem value="item-1">
                <AccordionHeader>
                  <AccordionTrigger>What is Lightforth?</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>
                  Lightforth is an AI-powered career platform that helps you build resumes, prepare for interviews, and auto-apply to jobs.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionHeader>
                  <AccordionTrigger>How does the copilot work?</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>
                  The copilot guides you through interview prep, live coding exercises, and meeting preparation with real-time AI assistance.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionHeader>
                  <AccordionTrigger>What plans are available?</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>
                  We offer Free, Pro, and Business plans with different credit allocations and feature access levels.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Collapsible */}
          <Section title="Collapsible">
            <Collapsible>
              <CollapsibleTrigger render={<button className="flex items-center gap-2 text-sm font-medium text-ink hover:text-accent" />}>
                <ChevronRight className="size-4 transition-transform [[data-open]&]:rotate-90" />
                Show details
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="mt-2 rounded-lg bg-surface-subtle p-4 text-sm text-ink-muted">
                  This is the collapsible content. It can contain anything — text, forms, other components.
                </div>
              </CollapsiblePanel>
            </Collapsible>
          </Section>

          {/* Popover */}
          <Section title="Popover">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger render={<Button variant="secondary">Open Popover</Button>} />
              <PopoverContent side="bottom">
                <div className="grid gap-2">
                  <p className="text-sm font-medium text-ink">Quick actions</p>
                  <p className="text-sm text-ink-muted">This is a popover with some content and actions.</p>
                  <Button size="sm" onClick={() => setPopoverOpen(false)}>Got it</Button>
                </div>
              </PopoverContent>
            </Popover>
          </Section>

          {/* Menu (Dropdown) */}
          <Section title="Menu (Dropdown)">
            <DropdownMenu>
              <MenuTrigger render={<Button variant="secondary">Open Menu</Button>} />
              <MenuContent align="start">
                <MenuItem icon={<Home />}>Dashboard</MenuItem>
                <MenuItem icon={<BarChart3 />}>Analytics</MenuItem>
                <MenuItem icon={<Settings />}>Settings</MenuItem>
                <MenuSeparator />
                <MenuItem variant="danger">Sign out</MenuItem>
              </MenuContent>
            </DropdownMenu>
          </Section>

          {/* ScrollArea */}
          <Section title="ScrollArea">
            <ScrollArea className="h-40 w-full rounded-lg border border-border">
              <div className="grid gap-3 p-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-subtle p-3">
                    <Avatar name={`U${i + 1}`} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-ink">User {i + 1}</p>
                      <p className="text-xs text-ink-muted">user{i + 1}@example.com</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Section>

          {/* Sheet (Drawer) */}
          <Section title="Sheet (Drawer)">
            <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="right">
                <SheetTitle>Settings</SheetTitle>
                <div className="mt-4 grid gap-4">
                  <TextField id="sheet-name" label="Name" placeholder="Enter your name" />
                  <TextField id="sheet-email" label="Email" placeholder="Enter your email" />
                  <div className="flex justify-end gap-3 pt-4">
                    <SheetClose render={<Button variant="secondary" />}>Cancel</SheetClose>
                    <Button onClick={() => { setSheetOpen(false); toast.success('Saved!') }}>Save</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </Section>

          {/* Navigator */}
          <Section title="Navigator">
            <div className="overflow-hidden rounded-lg border border-border">
              <Navigator
                logo={<span className="text-lg font-bold text-ink">LF</span>}
                items={[
                  { id: 'home', label: 'Home', icon: <Home />, href: '#', active: true },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 />, href: '#' },
                  { id: 'settings', label: 'Settings', icon: <Settings />, href: '#' },
                ]}
                footer={<p className="text-xs text-muted">v1.0.0</p>}
              />
            </div>
          </Section>
        </div>
      </div>
    </main>
  )
}
