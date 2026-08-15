import { forwardRef, type ReactNode } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight, FileText, ArrowUpDown } from 'lucide-react'

import { cn } from './cn'

export type DataTableColumn<TRow> = {
  readonly key: string
  readonly label: string
  readonly className?: string
  readonly headerClassName?: string
  readonly sortable?: boolean
  readonly render: (row: TRow) => ReactNode
}

export type DataTableAction = {
  readonly label: string
  readonly href: string
  readonly icon?: ReactNode
}

export type DataTablePagination = {
  readonly page: number
  readonly totalPages: number
  readonly totalItems: number
  readonly pageSize: number
}

export type DataTableProps<TRow extends { readonly id: string }> = {
  readonly title: string
  readonly searchLabel?: string
  readonly searchPlaceholder?: string
  readonly searchValue?: string
  readonly onSearchChange?: (value: string) => void
  readonly action?: DataTableAction
  readonly columns: readonly DataTableColumn<TRow>[]
  readonly rows: readonly TRow[]
  readonly itemLabel: (row: TRow) => string
  readonly pagination?: DataTablePagination
  readonly onPageChange?: (page: number) => void
  readonly className?: string
  readonly minTableWidthClassName?: string
}

export const DataTable = forwardRef<HTMLElement, DataTableProps<{ readonly id: string }>>(
  function DataTable<TRow extends { readonly id: string }>({
    title,
    searchLabel = `Search ${title}`,
    searchPlaceholder = 'Search',
    searchValue,
    onSearchChange,
    action,
    columns,
    rows,
    itemLabel,
    pagination,
    onPageChange,
    className,
    minTableWidthClassName = 'min-w-[72rem]',
  }: DataTableProps<TRow>, ref) {
    return (
      <article ref={ref} data-slot="data-table" className={cn('min-h-[56rem] bg-surface shadow-panel', className)}>
        <header className="flex min-h-[5rem] items-center border-b border-border px-8">
          <h1 className="text-xl font-medium leading-5 text-ink">{title}</h1>
        </header>

        <div className="p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <label className="relative block w-full max-w-[24rem]">
              <span className="sr-only">{searchLabel}</span>
              <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="min-h-10 w-full rounded-md border border-input bg-surface ps-9 pe-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
                placeholder={searchPlaceholder}
              />
            </label>

            {action ? (
              <a
                href={action.href}
                className="inline-flex min-h-10 items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="shrink-0 [&>svg]:size-5">{action.icon ?? <Plus aria-hidden="true" />}</span>
                {action.label}
              </a>
            ) : null}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className={cn('w-full border-collapse text-sm', minTableWidthClassName)}>
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                  <th className="w-12 px-4 py-2.5 text-start font-semibold">
                    <label className="grid size-7 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                      <span className="sr-only">Select all rows</span>
                      <input type="checkbox" className="size-3.5 rounded border-input text-accent focus:ring-focus" />
                    </label>
                  </th>
                  {columns.map((column) => (
                    <th key={column.key} className={cn('px-4 py-2.5 text-start font-semibold', column.headerClassName, column.className)}>
                      <span className="inline-flex items-center gap-1">
                        {column.label}
                        {column.sortable !== false && (
                          <ArrowUpDown aria-hidden="true" className="size-3 text-ink-muted" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-ink">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-3 py-12 text-center text-ink-muted">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <td className="px-4 py-2.5">
                        <label className="grid size-7 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                          <span className="sr-only">{`Select ${itemLabel(row)}`}</span>
                          <input type="checkbox" className="sr-only" />
                          <FileText aria-hidden="true" className="size-3.5 text-ink-muted" />
                        </label>
                      </td>
                      {columns.map((column) => (
                        <td key={column.key} className={cn('px-4 py-2.5 leading-5', column.className)}>
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination ? (
            <footer className="mt-3 flex flex-wrap items-center gap-10 px-6 py-2.5 text-sm font-medium leading-5 text-ink">
              <p>
                Showing items{' '}
                {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.totalItems)} -{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems}
              </p>
              <div className="inline-flex items-center gap-4">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  className="grid size-4 place-items-center text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
                <span>{pagination.page}</span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  className="grid size-4 place-items-center text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </footer>
          ) : null}
        </div>
      </article>
    )
  },
) as <TRow extends { readonly id: string }>(props: DataTableProps<TRow> & { ref?: React.Ref<HTMLElement> }) => React.JSX.Element
