import type { ContextDocumentRow } from '@/contracts/documents.draft'
import { DataTable, FormPanel, FormPanelFooter, FormTextArea, OptionStack, ShellBar } from '@/ui'

export type DocumentsViewProps = {
  readonly homeHref: string
  readonly addHref: string
  readonly rows: readonly ContextDocumentRow[]
}

export type DocumentsAddViewProps = {
  readonly homeHref: string
  readonly documentsHref: string
  readonly manualHref: string
}

export type DocumentsManualViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
}

function MoreButton({ label }: { readonly label: string }) {
  return (
    <button type="button" aria-label={label} className="grid size-6 place-items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      <img aria-hidden="true" src="/v3-assets/figma/table-more.svg" alt="" className="size-4 object-contain" />
    </button>
  )
}

export function DocumentsView({ homeHref, addHref, rows }: DocumentsViewProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ShellBar homeHref={homeHref} current="Knowledge Base" closeHref={homeHref} closeLabel="Close documents" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <DataTable
          title="Knowledge Base"
          searchLabel="Search documents"
          action={{ label: 'Add Document', href: addHref }}
          rows={rows}
          itemLabel={(row) => row.name}
          className="mx-auto max-w-7xl"
          columns={[
            { key: 'name', label: 'Name', className: 'w-[18rem]', render: (row) => <span className="font-medium">{row.name}</span> },
            {
              key: 'kind',
              label: 'Type',
              className: 'w-[9rem]',
              render: (row) => <span className="rounded-pill bg-surface-subtle px-2.5 py-0.5 text-xs font-bold leading-4 text-ink">{row.kind}</span>,
            },
            { key: 'size-or-url', label: 'Size/URL', className: 'w-[14rem]', render: (row) => row.sizeOrUrl },
            { key: 'added', label: 'Added', className: 'w-[18rem]', render: (row) => row.addedAtLabel },
            { key: 'action', label: 'Action', className: 'w-[5rem]', sortable: false, render: (row) => <MoreButton label={`Open actions for ${row.name}`} /> },
          ]}
        />
      </section>
    </div>
  )
}

export function DocumentsAddView({ homeHref, documentsHref, manualHref }: DocumentsAddViewProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ShellBar homeHref={homeHref} current="Knowledge Base" closeHref={homeHref} closeLabel="Close documents" />
      <section className="px-4 py-9">
        <FormPanel
          title="Add Documents"
          step="1/2"
          footer={<FormPanelFooter backHref={documentsHref} nextHref={documentsHref} nextLabel="Continue" />}
        >
          <OptionStack
            options={[
              { id: 'upload', label: 'Upload Documents', href: documentsHref, iconSrc: '/v3-assets/figma/form-upload.svg', variant: 'primary' },
              { id: 'url', label: 'Scrape from URL', href: documentsHref, iconSrc: '/v3-assets/figma/form-globe.svg' },
              { id: 'manual', label: 'Input Manually', href: manualHref, iconSrc: '/v3-assets/figma/form-pencil.svg' },
            ]}
          />
          <p className="text-xs font-medium leading-5 text-ink-muted">Add a file, webpage, or custom context for Lightforth to use across resumes and interviews.</p>
        </FormPanel>
      </section>
    </div>
  )
}

export function DocumentsManualView({ homeHref, backHref, nextHref }: DocumentsManualViewProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ShellBar homeHref={homeHref} current="Knowledge Base" closeHref={homeHref} closeLabel="Close documents" />
      <section className="px-4 py-9">
        <FormPanel
          title="Input Context Manually"
          step="1/2"
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} nextLabel="Save" />}
        >
          <FormTextArea
            id="manual-context"
            label="Paste context"
            placeholder="Paste notes, role requirements, portfolio highlights, or company research here."
          />
        </FormPanel>
      </section>
    </div>
  )
}
