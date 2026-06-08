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
  { agent: 'scout',  message: 'Found 6 new roles on LinkedIn',                            statsInc: { found: 6 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Scanning Greenhouse, Workday' } },
  { agent: 'filter', message: 'Scoring 6 jobs from Scout',                                statsInc: {},              agentPatch: { name: 'filter', status: 'running', currentTask: 'Scoring 6 jobs' } },
  { agent: 'scout',  message: 'Found 8 new roles on Greenhouse',                          statsInc: { found: 8 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Scanning Workday, Lever' } },
  { agent: 'filter', message: 'Passed 4 jobs ≥85% match · 2 rejected',                   statsInc: { matched: 4 },  agentPatch: { name: 'filter', status: 'running', currentTask: 'Scoring next batch' } },
  { agent: 'tailor', message: 'Building resume for JPMorgan Chase',                       statsInc: {},              agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for JPMorgan Chase' } },
  { agent: 'scout',  message: 'Scanned 34 listings on Workday — 5 relevant roles',        statsInc: { found: 5 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Scanning Lever, Indeed' } },
  { agent: 'tailor', message: 'Resume tailored for JPMorgan Chase — ATS score 94/100',    statsInc: { tailored: 1 }, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for Citibank' } },
  { agent: 'driver', message: 'Submitted application — JPMorgan Chase · Req #8821 ✓',     statsInc: { applied: 1 },  agentPatch: { name: 'driver', status: 'working', currentTask: 'Filling form for Citibank' } },
  { agent: 'filter', message: 'Rejected 3 jobs below 85% — KPMG, Deloitte, EY',          statsInc: {},              agentPatch: null },
  { agent: 'tailor', message: 'Resume tailored for Citibank — ATS score 91/100',          statsInc: { tailored: 1 }, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for Goldman Sachs' } },
  { agent: 'driver', message: 'Submitted application — Citibank · Req #C-4401 ✓',         statsInc: { applied: 1 },  agentPatch: { name: 'driver', status: 'idle',    currentTask: 'Waiting for next tailored doc' } },
  { agent: 'scout',  message: 'Found "Compliance Analyst" at Goldman Sachs — 92% match',  statsInc: { found: 1 },    agentPatch: { name: 'scout',  status: 'running', currentTask: 'Continuing scan...' } },
]

let _counter = 0

export function useAgentSession(_studentId: string): AgentSession {
  const [session, setSession] = useState<AgentSession>({
    stats: { found: 0, matched: 0, tailored: 0, applied: 0 },
    agents: INITIAL_AGENTS,
    events: [
      { id: 'seed-1', timestamp: new Date(), agent: 'system', message: 'Agent session started' },
      { id: 'seed-2', timestamp: new Date(), agent: 'scout',  message: 'Started scanning LinkedIn, Greenhouse, Lever' },
    ],
  })

  const stepRef = useRef(0)

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
          id: `tick-${++_counter}`,
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
