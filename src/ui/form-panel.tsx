import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FormHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Sparkles } from 'lucide-react'

import { cn } from './cn'

export type FormUploadedFile = {
  readonly fileName: string
  readonly changeHref: string
}

export type FormPanelProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'title'> & {
  readonly title: string
  readonly step?: string
  readonly uploadedFile?: FormUploadedFile
  readonly footer?: ReactNode
  readonly children: ReactNode
  readonly className?: string
}

export function FormPanel({ title, step, uploadedFile, footer, children, className, ...props }: FormPanelProps) {
  return (
    <form data-slot="form-panel" className={cn('mx-auto w-full max-w-[30.3125rem] border border-border bg-surface shadow-panel', className)} {...props}>
      <header data-slot="form-panel-header" className="flex min-h-20 items-center justify-center gap-2 border-b border-border px-6 py-7 text-center">
        <h1 className="text-xl font-medium leading-7 text-ink">{title}</h1>
        {step ? <span className="text-sm font-medium leading-5 text-ink-muted">{step}</span> : null}
      </header>
      {uploadedFile ? <UploadedFileStrip fileName={uploadedFile.fileName} changeHref={uploadedFile.changeHref} /> : null}
      <div data-slot="form-panel-body" className="grid gap-3 px-6 py-8 sm:px-8">
        {children}
      </div>
      {footer}
    </form>
  )
}

export type UploadedFileStripProps = {
  readonly fileName: string
  readonly changeHref: string
  readonly className?: string
}

export function UploadedFileStrip({ fileName, changeHref, className }: UploadedFileStripProps) {
  return (
    <div
      data-slot="uploaded-file-strip"
      className={cn('mx-auto flex min-h-8 w-[calc(100%-4rem)] max-w-[422px] items-center justify-between gap-3 rounded-b-lg bg-accent-subtle py-[4.5px] pe-[9px] ps-[18px] text-[12.582px] font-normal leading-none text-ink-muted', className)}
    >
      <span className="inline-flex min-w-0 items-center gap-1">
        <img aria-hidden="true" src="/v3-assets/figma/form-file.svg" alt="" className="h-[14.38px] w-[14.38px] shrink-0" />
        <span className="truncate">{fileName}</span>
        <span className="grid size-[9px] shrink-0 place-items-center">
          <img aria-hidden="true" src="/v3-assets/figma/form-file-close.svg" alt="" className="h-[5.25px] w-[5.25px]" />
        </span>
      </span>
      <a href={changeHref} className="shrink-0 text-[10.5px] font-semibold leading-[18px] text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        Change
      </a>
    </div>
  )
}

export type FormPanelFooterProps = {
  readonly backHref: string
  readonly nextHref: string
  readonly nextLabel?: string
  readonly backLabel?: string
  readonly nextIconSrc?: string
  readonly className?: string
}

export function FormPanelFooter({ backHref, nextHref, nextLabel = 'Continue', backLabel = 'Back', nextIconSrc, className }: FormPanelFooterProps) {
  return (
    <footer data-slot="form-panel-footer" className={cn('flex items-center justify-between gap-4 border-t border-border px-6 py-4', className)}>
      <a href={backHref} className="inline-flex min-h-11 items-center gap-1 rounded-lg py-2.5 text-base font-semibold leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <span className="grid size-[18px] shrink-0 place-items-center">
          <img aria-hidden="true" src="/v3-assets/figma/form-arrow-left.svg" alt="" className="size-3" />
        </span>
        {backLabel}
      </a>
      <a href={nextHref} className="inline-flex min-h-11 w-[150px] items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2.5 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        {nextLabel}
        {nextIconSrc ? <img aria-hidden="true" src={nextIconSrc} alt="" className="size-5 shrink-0" /> : null}
      </a>
    </footer>
  )
}

export type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export function FormField({ id, label, error, className, ...props }: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div data-slot="form-field" className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('min-h-11 rounded-lg border border-input bg-surface px-3 py-2.5 text-sm leading-6 text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus', className)}
        {...props}
      />
      {error ? (
        <p id={errorId} aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export type FormSelectOption = {
  readonly label: string
  readonly value: string
}

export type FormSelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly options: readonly FormSelectOption[]
  readonly error?: string
}

export function FormSelectField({ id, label, options, error, className, ...props }: FormSelectFieldProps) {
  const errorId = `${id}-error`

  return (
    <div data-slot="form-select-field" className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
        {label}
      </label>
      <span className="relative block">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn('min-h-11 w-full appearance-none rounded-lg border border-input bg-surface py-2.5 pe-10 ps-3 text-sm leading-6 text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus', className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img aria-hidden="true" src="/v3-assets/figma/form-chevron-down.svg" alt="" className="pointer-events-none absolute end-3 top-1/2 h-1.5 w-2.5 -translate-y-1/2" />
      </span>
      {error ? (
        <p id={errorId} aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export type FormTextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export function FormTextArea({ id, label, error, className, ...props }: FormTextAreaProps) {
  const errorId = `${id}-error`

  return (
    <div data-slot="form-textarea" className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
        {label}
      </label>
      <span className="relative block">
        <textarea
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn('min-h-40 w-full resize-none rounded-lg border border-input bg-surface px-3.5 py-3 text-base text-ink shadow-control outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus sm:text-sm', className)}
          {...props}
        />
        <img aria-hidden="true" src="/v3-assets/figma/form-resize.svg" alt="" className="pointer-events-none absolute bottom-2 end-2 size-3" />
      </span>
      {error ? (
        <p id={errorId} aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export type AiSuggestionActionProps = ButtonHTMLAttributes<HTMLButtonElement>

export function AiSuggestionAction({ className, type = 'button', children = 'AI Suggestion', ...props }: AiSuggestionActionProps) {
  return (
    <button
      data-slot="ai-suggestion-action"
      type={type}
      className={cn('ms-auto inline-flex min-h-7 items-center gap-1 rounded-soft px-1 text-sm font-semibold leading-5 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
      {...props}
    >
      <Sparkles aria-hidden="true" className="size-4 stroke-[1.75]" />
      {children}
    </button>
  )
}

export type DocumentDropActionProps = {
  readonly label?: string
  readonly actionLabel?: string
  readonly hint?: string
  readonly actionHref: string
  readonly className?: string
}

export function DocumentDropAction({ label = 'Documents', actionLabel = 'Add Documents', hint = 'Add context, notes, or other docs', actionHref, className }: DocumentDropActionProps) {
  return (
    <section data-slot="document-drop-action" className={cn('grid gap-2', className)} aria-labelledby="document-drop-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="document-drop-title" className="text-sm font-medium leading-5 text-ink">
          {label} <span className="font-normal text-ink-muted">(optional)</span>
        </h2>
        <a href={actionHref} className="inline-flex min-h-8 items-center gap-1 rounded-lg px-1 text-sm font-semibold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <img aria-hidden="true" src="/v3-assets/figma/form-plus.svg" alt="" className="size-5" />
          {actionLabel}
        </a>
      </div>
      <a href={actionHref} className="grid min-h-20 place-items-center rounded-lg border border-dashed border-input bg-surface-subtle px-4 py-6 text-center text-sm font-medium text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        {hint}
      </a>
    </section>
  )
}

export type FormChoiceOption<TValue extends string = string> = {
  readonly label: string
  readonly value: TValue
}

export type FormChoiceGroupProps<TValue extends string = string> = {
  readonly label: string
  readonly name: string
  readonly options: readonly FormChoiceOption<TValue>[]
  readonly selected: TValue
  readonly className?: string
}

export function FormChoiceGroup<TValue extends string = string>({ label, name, options, selected, className }: FormChoiceGroupProps<TValue>) {
  return (
    <section data-slot="form-choice-group" className={cn('grid gap-2.5', className)}>
      <h2 className="text-xs font-semibold leading-5 text-ink-muted">{label}</h2>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            data-slot="form-choice"
            data-variant={option.value === selected ? 'selected' : 'default'}
            className={cn(
              'flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold focus-within:ring-2 focus-within:ring-focus',
              option.value === selected ? 'border-accent bg-accent-subtle text-accent shadow-control' : 'border-input bg-surface text-ink-muted hover:border-border hover:text-ink',
            )}
          >
            <input type="radio" name={name} value={option.value} className="sr-only" defaultChecked={option.value === selected} />
            <span className={cn('grid size-4 place-items-center rounded-full border', option.value === selected ? 'border-accent bg-surface' : 'border-input bg-surface')}>
              {option.value === selected ? <span className="size-2 rounded-full bg-accent" /> : null}
            </span>
            {option.label}
          </label>
        ))}
      </div>
    </section>
  )
}

export type ExampleResponseCardProps = {
  readonly children: ReactNode
  readonly helperText?: string
}

export function ExampleResponseCard({ children, helperText }: ExampleResponseCardProps) {
  return (
    <div data-slot="example-response-card" className="grid gap-3">
      <blockquote className="rounded-lg border border-border bg-surface-subtle px-4 py-3 text-sm font-medium leading-7 text-ink shadow-control">
        {children}
      </blockquote>
      {helperText ? <p className="text-xs font-semibold leading-5 text-ink-muted">{helperText}</p> : null}
    </div>
  )
}

export type PermissionStepItem = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly status: 'available' | 'complete' | 'disabled'
  readonly actionLabel: string
  readonly iconSrc: string
}

export type PermissionStepsProps = {
  readonly steps: readonly PermissionStepItem[]
  readonly actionHref: string
  readonly previewSrc?: string
  readonly startHref?: string
  readonly startLabel?: string
}

export function PermissionSteps({ steps, actionHref, previewSrc, startHref, startLabel = 'Start' }: PermissionStepsProps) {
  return (
    <div data-slot="permission-steps" className="grid gap-4">
      {steps.map((step, index) => (
        <section key={step.id} className="grid gap-3 rounded-lg border border-border bg-surface p-3 shadow-control">
          <div className="flex items-start gap-3">
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold', step.status === 'complete' ? 'bg-positive-surface text-positive' : 'bg-accent text-on-accent')}>
              {step.status === 'complete' ? <img aria-hidden="true" src="/v3-assets/figma/form-check.svg" alt="" className="size-4" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-5 text-ink">{step.title}</span>
              <span className="mt-1 block text-xs font-medium leading-5 text-ink-muted">{step.description}</span>
            </span>
          </div>
          {previewSrc && step.id === 'screen' ? <img src={previewSrc} alt="" className="aspect-video w-full rounded-lg object-cover" /> : null}
          {step.status !== 'complete' ? (
            <a
              href={actionHref}
              aria-disabled={step.status === 'disabled'}
              className={cn(
                'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                step.status === 'disabled' ? 'pointer-events-none bg-muted text-on-accent opacity-50' : 'bg-accent text-on-accent shadow-control',
              )}
            >
              <img aria-hidden="true" src={step.iconSrc} alt="" className="size-5" />
              {step.actionLabel}
            </a>
          ) : null}
        </section>
      ))}
      {startHref ? (
        <a href={startHref} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {startLabel}
          <img aria-hidden="true" src="/v3-assets/figma/form-chevron-right.svg" alt="" className="size-5" />
        </a>
      ) : null}
    </div>
  )
}

export type SummaryRow = {
  readonly id: string
  readonly title: string
  readonly value: ReactNode
  readonly iconSrc: string
  readonly href?: string
}

export type ReviewSummaryListProps = {
  readonly rows: readonly SummaryRow[]
}

export function ReviewSummaryList({ rows }: ReviewSummaryListProps) {
  return (
    <div data-slot="review-summary-list" className="grid gap-3">
      {rows.map((row) => {
        const content = (
          <>
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent-subtle">
              <img aria-hidden="true" src={row.iconSrc} alt="" className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-5 text-ink">{row.title}</span>
              <span className="mt-1 block truncate text-sm font-medium leading-5 text-ink-muted">{row.value}</span>
            </span>
            <img aria-hidden="true" src="/v3-assets/figma/form-review-chevron.svg" alt="" className="size-5 shrink-0" />
          </>
        )

        return row.href ? (
          <a key={row.id} href={row.href} className="flex min-h-17 items-center gap-3 rounded-lg bg-surface-raised p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {content}
          </a>
        ) : (
          <div key={row.id} className="flex min-h-17 items-center gap-3 rounded-lg bg-surface-raised p-3">
            {content}
          </div>
        )
      })}
    </div>
  )
}

export type OptionStackItem = {
  readonly id: string
  readonly label: string
  readonly href: string
  readonly iconSrc: string
  readonly variant?: 'default' | 'primary'
  readonly disabled?: boolean
}

export type OptionStackProps = {
  readonly options: readonly OptionStackItem[]
  readonly className?: string
}

export function OptionStack({ options, className }: OptionStackProps) {
  return (
    <div data-slot="option-stack" className={cn('grid gap-3', className)}>
      {options.map((option) => (
        <a
          key={option.id}
          href={option.href}
          aria-disabled={option.disabled}
          className={cn(
            'flex min-h-14 items-center gap-3 rounded-lg border border-input bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            option.disabled ? 'pointer-events-none opacity-50' : 'hover:bg-surface-subtle',
          )}
        >
          <span className={cn('grid size-7 shrink-0 place-items-center rounded-md', option.variant === 'primary' ? 'bg-accent' : '')}>
            <img aria-hidden="true" src={option.iconSrc} alt="" className="size-5" />
          </span>
          {option.label}
        </a>
      ))}
    </div>
  )
}

export type GoogleAuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function GoogleAuthButton({ className, type = 'button', children = 'Sign in with Google', ...props }: GoogleAuthButtonProps) {
  return (
    <button
      data-slot="google-auth-button"
      type={type}
      className={cn('inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-input bg-surface px-4 py-2 text-base font-semibold text-ink shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
      {...props}
    >
      <span aria-hidden="true" className="relative block size-6 overflow-hidden">
        <img className="absolute end-0 top-2.5 h-3 w-3" src="/v3-assets/figma/form-google-blue.svg" alt="" />
        <img className="absolute bottom-0 start-1 h-2.5 w-4" src="/v3-assets/figma/form-google-green.svg" alt="" />
        <img className="absolute start-0 top-1.5 h-3 w-1.5" src="/v3-assets/figma/form-google-yellow.svg" alt="" />
        <img className="absolute start-1 top-0 h-2.5 w-4" src="/v3-assets/figma/form-google-red.svg" alt="" />
      </span>
      {children}
    </button>
  )
}

export type FormDividerLabelProps = {
  readonly children: ReactNode
  readonly className?: string
}

export function FormDividerLabel({ children, className }: FormDividerLabelProps) {
  return (
    <div data-slot="form-divider-label" className={cn('flex items-center gap-3', className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-sm font-medium leading-5 text-ink">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export type FormLinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  readonly variant?: 'primary' | 'secondary'
}

export function FormLinkButton({ className, variant = 'primary', children, ...props }: FormLinkButtonProps) {
  return (
    <a
      data-slot="form-link-button"
      data-variant={variant}
      className={cn(
        'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        variant === 'primary' ? 'bg-accent text-on-accent' : 'border border-input bg-surface text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
