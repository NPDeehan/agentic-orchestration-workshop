/**
 * Template for judging/hidden-prompts.ts, which is kept out of git so attendees can't read it.
 * Copy this file to hidden-prompts.ts and fill it in. /judge (npm run dev only) shows these next to
 * each challenge. Keys are challenge ids from locales/en.ts.
 *
 * A criterion only scores if it holds for the published prompts AND these.
 * `check` tells the judge what to look at, so scoring is the same whoever judges.
 */
export interface HiddenTest { prompt: string; check: string }

export const hiddenPrompts: Record<string, HiddenTest[]> = {
  'customer-360': [
    { prompt: 'An unpublished prompt for this challenge.', check: 'What the judge should look for.' },
  ],
}
