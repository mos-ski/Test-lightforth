import type { ReactNode } from 'react'

import { cn } from './cn'

const figmaAssetBase = '/v3-assets/figma'

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
  readonly iconSrc?: string
}

export type DataTableProps<TRow extends { readonly id: string }> = {
  readonly title: string
  readonly searchLabel?: string
  readonly searchPlaceholder?: string
  readonly action?: DataTableAction
  readonly columns: readonly DataTableColumn<TRow>[]
  readonly rows: readonly TRow[]
  readonly itemLabel: (row: TRow) => string
  readonly paginationLabel?: string
  readonly className?: string
  readonly minTableWidthClassName?: string
}

function TableIcon({ src, className }: { readonly src: string; readonly className?: string }) {
  return <img aria-hidden="true" src={src} alt="" className={cn('size-full object-contain', className)} />
}

export function DataTable<TRow extends { readonly id: string }>({
  title,
  searchLabel = `Search ${title}`,
  searchPlaceholder = 'Search',
  action,
  columns,
  rows,
  itemLabel,
  paginationLabel = 'Showing items 1 - 10 of 146',
  className,
  minTableWidthClassName = 'min-w-[72rem]',
}: DataTableProps<TRow>) {
  return (
    <article data-slot="data-table" className={cn('min-h-[56.1rem] bg-surface shadow-panel', className)}>
      <header className="flex h-[85px] items-center border-b border-border px-8">
        <h1 className="text-xl font-medium leading-5 text-ink">{title}</h1>
      </header>

      <div className="p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <label className="relative block w-full max-w-[24.375rem]">
            <span className="sr-only">{searchLabel}</span>
            <span className="pointer-events-none absolute start-3 top-1/2 grid h-[18px] w-[16.781px] -translate-y-1/2 place-items-center">
              <TableIcon src={`${figmaAssetBase}/table-search-resume.svg`} />
            </span>
            <input
              className="min-h-10 w-full rounded-md border border-input bg-surface ps-9 pe-3 text-sm text-ink outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus"
              placeholder={searchPlaceholder}
            />
          </label>

          {action ? (
            <a
              href={action.href}
              className="inline-flex min-h-10 min-w-[150px] items-center justify-center gap-3 rounded-lg bg-accent px-4 py-[7px] text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="grid size-6 place-items-center">
                <TableIcon src={action.iconSrc ?? `${figmaAssetBase}/table-plus.svg`} />
              </span>
              {action.label}
            </a>
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className={cn('w-full border-collapse text-sm', minTableWidthClassName)}>
            <thead>
              <tr className="h-[45px] border-b border-border bg-surface-subtle text-ink-muted">
                <th className="w-[4.9rem] px-3 py-0 text-start font-semibold">
                  <label className="grid size-7 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                    <span className="sr-only">Select all rows</span>
                    <input type="checkbox" className="size-[14px] rounded border-input text-accent focus:ring-focus" />
                  </label>
                </th>
                {columns.map((column) => (
                  <th key={column.key} className={cn('px-3 py-0 text-start font-semibold', column.headerClassName, column.className)}>
                    <span className="inline-flex items-center gap-1">
                      {column.label}
                      {column.sortable === false ? null : (
                        <span className="grid size-3 place-items-center">
                          <TableIcon src={`${figmaAssetBase}/table-sort.svg`} />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink">
              {rows.map((row) => (
                <tr key={row.id} className="h-[45px] border-b border-border">
                  <td className="px-3 py-0">
                    <label className="grid size-7 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                      <span className="sr-only">{`Select ${itemLabel(row)}`}</span>
                      <input type="checkbox" className="sr-only" />
                      <span className="grid size-[14px] place-items-center">
                        <TableIcon src={`${figmaAssetBase}/table-row-document.svg`} />
                      </span>
                    </label>
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-3 py-0 leading-5', column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-3 flex flex-wrap items-center gap-10 px-6 py-2.5 text-sm font-medium leading-5 text-ink">
          <p>{paginationLabel}</p>
          <div className="inline-flex items-center gap-4">
            <span className="grid size-4 place-items-center opacity-45" aria-hidden="true">
              <TableIcon src={`${figmaAssetBase}/table-page-prev.svg`} />
            </span>
            <span>1</span>
            <span className="grid size-4 place-items-center" aria-hidden="true">
              <TableIcon src={`${figmaAssetBase}/table-page-next.svg`} />
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
