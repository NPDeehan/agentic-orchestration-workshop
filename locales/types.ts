export type Tone = 'orange' | 'purple' | 'green'
export type Level = 1 | 2 | 3

export interface Tool {
  key: string
  name: string
  text: string
  inputs: string[]
  ops?: string[]
  phase1?: boolean
}

export interface Challenge {
  id: string
  level: Level
  title: string
  goal: string
  prompts: string[]
  done: { text: string; points: number }[]
  /** eligible for the +50% process-enforcement bonus */
  bonus?: boolean
  connectors: string[]
  practice: string[]
  hint?: string
}

export interface LoopStep { key?: string; actor: 'llm' | 'engine'; title: string; short: string; text: string }

export type ArchKind = 'camunda' | 'yours' | 'people' | 'agent'

export interface ArchPart {
  title: string
  kind: ArchKind
  /** one line shown in the box */
  sub: string
  summary: string
  points: string[]
  /** how the part shows up in this workshop */
  workshop?: string
}

export interface Locale {
  architecture: {
    hintEyebrow: string
    hintTitle: string
    hint: string
    groupHint: string
    workshopLabel: string
    kinds: Record<ArchKind, string>
    bands: Record<'design' | 'cluster', string>
    edges: Record<string, string>
    parts: Record<string, ArchPart>
  }
  ui: Record<string, any> & { levels: Record<Level, string> }
  loop: {
    actors: { llm: string; engine: string }
    entry: LoopStep
    steps: LoopStep[]
    again: LoopStep
    exit: LoopStep
    idle: { eyebrow: string; title: string; text: string }
  }
  spectrum: {
    deterministic: { label: string; title: string; text: string; traits: string[]; examples: string[] }
    dynamic: { label: string; title: string; text: string; traits: string[]; examples: string[] }
    agentic: { label: string; title: string; text: string; examples: string[] }
  }
  domains: { key: string; title: string; tone: Tone; icon?: string; tools: Tool[] }[]
  challenges: Challenge[]
  scoring: {
    title: string
    levels: Record<Level, number>
    rules: { icon: string; title: string; text: string }[]
    bonusLabel: string
  }
}
