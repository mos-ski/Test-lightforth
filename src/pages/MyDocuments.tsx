import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FilePlus,
  Upload,
  Link2,
  MoreHorizontal,
  Search,
  LayoutList,
  LayoutGrid,
  FileText,
  ArrowDownUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mockResumes = [
  {
    id: '1',
    title: 'Darnell_Smith_Design_Engineer.pdf',
    atsScore: 38,
    modified: 'Apr 30, 2026 at 05:47 PM',
    created: 'Apr 30, 2026 at 05:47 PM',
  },
  {
    id: '2',
    title: 'Darnell_Smith_Product_Manager_&_Design_Engineer.pdf',
    atsScore: 86,
    modified: 'Apr 20, 2026 at 05:29 PM',
    created: 'Apr 20, 2026 at 05:27 PM',
  },
  {
    id: '3',
    title: 'Darnell_Smith_Product_Manager_Design_Engineer_AI_Builder.pdf',
    atsScore: 58,
    modified: 'Apr 20, 2026 at 05:26 PM',
    created: 'Apr 20, 2026 at 05:25 PM',
  },
  {
    id: '4',
    title: 'Smith_Darnell_Design_Engineer.pdf',
    atsScore: 0,
    modified: 'Apr 3, 2026 at 12:57 AM',
    created: 'Apr 3, 2026 at 12:57 AM',
  },
]

function atsColor(score: number) {
  if (score === 0) return 'bg-gray-200 text-gray-500'
  if (score >= 70) return 'bg-green-500 text-white'
  if (score >= 40) return 'bg-yellow-500 text-white'
  return 'bg-red-400 text-white'
}

export default function MyDocuments() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'yours' | 'ai'>('yours')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [search, setSearch] = useState('')

  const filteredResumes = mockResumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Resumes</h1>
      </div>

      {/* Create a new resume section */}
      <p className="text-sm font-semibold text-foreground mb-1">Create a new resume</p>
      <p className="text-xs text-muted-foreground mb-4">Choose a starting point for your resume</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Card 1: Create from scratch */}
        <div
          className="lf-panel cursor-pointer p-5 transition-all hover:border-violet-300 hover:shadow-sm"
          onClick={() => navigate('/resume-builder')}
        >
          <div className="rounded-lg bg-violet-100 p-2.5 mb-3 w-fit">
            <FilePlus className="h-5 w-5 text-violet-600" />
          </div>
          <p className="text-sm font-semibold text-violet-600">Create from scratch</p>
          <p className="text-xs text-muted-foreground mt-1">Use AI to build your resume</p>
        </div>

        {/* Card 2: Create from a resume */}
        <div
          className="lf-panel cursor-pointer p-5 transition-all hover:border-green-300 hover:shadow-sm"
          onClick={() => navigate('/resume-builder')}
        >
          <div className="rounded-lg bg-green-100 p-2.5 mb-3 w-fit">
            <Upload className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-green-600">Create from a resume</p>
          <p className="text-xs text-muted-foreground mt-1">Click to upload PDF or DOCX. (max. 5MB)</p>
        </div>

        {/* Card 3: From a Link */}
        <div className="lf-panel relative cursor-not-allowed p-5 opacity-60">
          <span className="absolute top-3 right-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 font-medium">
            Coming soon
          </span>
          <div className="rounded-lg bg-gray-100 p-2.5 mb-3 w-fit">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-400">From a Link</p>
          <p className="text-xs text-muted-foreground mt-1">Upload a google docs or LinkedIn profile link.</p>
        </div>
      </div>

      {/* History section */}
      <h2 className="text-base font-semibold text-foreground mt-8 mb-4">History</h2>

      {/* Tabs */}
      <div className="lf-tabs mb-4">
        <button
          className={cn(
            'lf-tab',
            activeTab === 'yours' && 'lf-tab-active'
          )}
          onClick={() => setActiveTab('yours')}
        >
          Created by you
        </button>
        <button
          className={cn(
            'lf-tab',
            activeTab === 'ai' && 'lf-tab-active'
          )}
          onClick={() => setActiveTab('ai')}
        >
          Created by AI
        </button>
      </div>

      {/* Search + view toggle row */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, job title, location..."
            className="lf-input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'list' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setViewMode('list')}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'grid' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
          <tr>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                Title <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                ATS Score <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                Modified <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                Created <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredResumes.map((resume) => (
            <tr
              key={resume.id}
              className="lf-table-row"
            >
              <td className="lf-table-cell">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate max-w-xs">{resume.title}</span>
                </span>
              </td>
              <td className="lf-table-cell">
                <span
                  className={cn(
                    'rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold',
                    atsColor(resume.atsScore)
                  )}
                >
                  {resume.atsScore}
                </span>
              </td>
              <td className="lf-table-cell text-muted-foreground">{resume.modified}</td>
              <td className="lf-table-cell text-muted-foreground">{resume.created}</td>
              <td className="lf-table-cell">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
