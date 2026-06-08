// src/hooks/useAgentSession.ts
import { useState, useEffect, useRef } from 'react'

export type AgentName = 'scout' | 'filter' | 'tailor' | 'driver' | 'system'

export interface FeedEvent {
  id: string
  timestamp: Date
  agent: AgentName
  message: string
}

export interface AgentStatus {
  name: AgentName
  label: string
  status: 'running' | 'working' | 'idle'
  currentTask: string
}

export interface AgentSessionStats {
  found: number
  matched: number
  tailored: number
  applied: number
}

export interface AgentSession {
  stats: AgentSessionStats
  agents: AgentStatus[]
  events: FeedEvent[]
}

const INITIAL_AGENTS: AgentStatus[] = [
  { name: 'scout',  label: 'Scout',  status: 'running', currentTask: 'Scanning LinkedIn, Greenhouse, Lever' },
  { name: 'filter', label: 'Filter', status: 'idle',    currentTask: 'Waiting for jobs' },
  { name: 'tailor', label: 'Tailor', status: 'idle',    currentTask: 'Waiting for matched jobs' },
  { name: 'driver', label: 'Driver', status: 'idle',    currentTask: 'Waiting for tailored docs' },
]

interface TickStep {
  agent: AgentName
  message: string
  statsInc: Partial<AgentSessionStats>
  agentPatch: { name: AgentName; status: AgentStatus['status']; currentTask: string } | null
}

const TICK_STEPS: TickStep[] = [
  { agent: 'scout',  message: 'Scanned LinkedIn — found 6 new roles matching GRC Analyst criteria (seniority: mid-senior, location: New York). Passing to Filter.',                                                      statsInc: { found: 6 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Scanning Greenhouse, Workday' } },
  { agent: 'filter', message: 'Received 6 jobs from Scout. Running match scoring against student profile — checking title alignment, required certs, location, and salary range.',                                        statsInc: {},              agentPatch: { name: 'filter', status: 'running', currentTask: 'Scoring 6 jobs' } },
  { agent: 'scout',  message: 'Scanned Greenhouse — found 8 new postings. 3 are GRC roles at FS firms, 5 are adjacent compliance roles. All forwarded to Filter queue.',                                                 statsInc: { found: 8 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Scanning Workday, Lever' } },
  { agent: 'filter', message: 'Scored 6 LinkedIn jobs — 4 passed (≥85% match), 2 rejected. Top match: "GRC Analyst" at Barclays (91%). Passed roles queued for resume tailoring.',                                      statsInc: { matched: 4 },  agentPatch: { name: 'filter', status: 'running', currentTask: 'Scoring next batch' } },
  { agent: 'tailor', message: 'Starting resume tailoring for JPMorgan Chase "Compliance Analyst" (Req #8821). Mapping student certs and experience to JD keywords. Estimated ATS optimisation in progress.',             statsInc: {},              agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for JPMorgan Chase' } },
  { agent: 'scout',  message: 'Scanned 34 Workday listings — 5 relevant roles identified (GRC, Risk, Compliance). Skipped 29 due to title mismatch or salary below threshold. Forwarding 5 to Filter.',                 statsInc: { found: 5 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Scanning Lever, Indeed' } },
  { agent: 'tailor', message: 'Resume tailored for JPMorgan Chase — ATS score 94/100. Highlighted CISA certification, GRC framework experience, and NYC availability. Document ready for Driver.',                        statsInc: { tailored: 1 }, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for Citibank' } },
  { agent: 'driver', message: 'Submitted application to JPMorgan Chase (Req #8821) ✓ — filled all form fields, attached tailored resume, answered 3 screening questions. Confirmation email expected within 24h.',        statsInc: { applied: 1 },  agentPatch: { name: 'driver', status: 'working', currentTask: 'Filling form for Citibank' } },
  { agent: 'filter', message: 'Scored Greenhouse batch — rejected 3 roles below 85% threshold: KPMG (78%, no hybrid option), Deloitte (72%, requires Big 4 background), EY (69%, title mismatch). 5 roles passed.',     statsInc: {},              agentPatch: null },
  { agent: 'tailor', message: 'Resume tailored for Citibank "Risk & Compliance Analyst" — ATS score 91/100. Emphasised Basel III exposure and regulatory reporting skills as listed in JD. Ready for Driver.',            statsInc: { tailored: 1 }, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for Goldman Sachs' } },
  { agent: 'driver', message: 'Submitted application to Citibank (Req #C-4401) ✓ — multi-step form completed, cover letter attached, EEO fields filled. Application ID saved. Awaiting acknowledgement.',                statsInc: { applied: 1 },  agentPatch: { name: 'driver', status: 'idle',    currentTask: 'Waiting for next tailored doc' } },
  { agent: 'scout',  message: 'Found "Compliance Analyst" at Goldman Sachs via LinkedIn — 92% match score. Role is hybrid NYC, requires 3+ yrs GRC, lists CISA as preferred cert. Flagged as high priority for Tailor.', statsInc: { found: 1 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Continuing scan...' } },
]

export function useAgentSession(_studentId: string): AgentSession {
  const [session, setSession] = useState<AgentSession>({
    stats: { found: 0, matched: 0, tailored: 0, applied: 0 },
    agents: INITIAL_AGENTS,
    events: [
      { id: 'seed-1', timestamp: new Date(), agent: 'system', message: 'Agent session initialised for student. Pipeline active — Scout is running, Filter, Tailor and Driver are on standby.' },
      { id: 'seed-2', timestamp: new Date(), agent: 'scout',  message: 'Starting job scan across LinkedIn, Greenhouse, and Lever. Filters loaded: title=GRC/Compliance/Risk, location=New York, seniority=mid-senior.' },
    ],
  })

  const stepRef = useRef(0)
  const counterRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const step = TICK_STEPS[stepRef.current % TICK_STEPS.length]
      stepRef.current += 1
      setSession(prev => {
        const newStats: AgentSessionStats = {
          found:    prev.stats.found    + (step.statsInc.found    ?? 0),
          matched:  prev.stats.matched  + (step.statsInc.matched  ?? 0),
          tailored: prev.stats.tailored + (step.statsInc.tailored ?? 0),
          applied:  prev.stats.applied  + (step.statsInc.applied  ?? 0),
        }
        const newAgents = step.agentPatch
          ? prev.agents.map(a =>
              a.name === step.agentPatch!.name
                ? { ...a, status: step.agentPatch!.status, currentTask: step.agentPatch!.currentTask }
                : a
            )
          : prev.agents
        const newEvent: FeedEvent = {
          id: `tick-${++counterRef.current}`,
          timestamp: new Date(),
          agent: step.agent,
          message: step.message,
        }
        return { stats: newStats, agents: newAgents, events: [...prev.events, newEvent] }
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return session
}
