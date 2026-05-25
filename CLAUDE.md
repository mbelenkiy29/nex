# NexExam — agent guidance

## Frontend design standard

Read **`packages/frontend/DESIGN.md`** whenever you create a new component, retrofit
a screen, or wire a new flow. It captures the NexExam UX + UI rules adapted from
OpenAI's Apps SDK guidelines (atomic surfaces, one primary CTA per card, restrained
color, system typography, accessibility minimums, shadcn primitives, no nested
scrolling, required empty states).

Apply the rules on every UI change. If a rule conflicts with a real product need,
flag the exception in the response or PR — do not silently bend a rule.

## Translations

The backend dictionary lives in `packages/backend/src/translation/{en,es,fr,de,pt-BR}/`
and is enforced at boot by `dictionaryIntegrityCheck` — every new key must be added
to **all 5 locale files** in the same change. English fallback values in non-English
dictionaries are temporary only; run `pnpm translation:audit` and clean launch-facing
fallbacks before release.

## Database (Neon, single production branch)

Per [[neon-db-constraints]] in agent memory: db-push workflow, single production
branch. Never run `migrate-deploy` or the backend test suite against it. Schema
changes are additive only and require explicit user confirmation before applying via
the Neon MCP `run_sql_transaction`.

## Memory

Session-loaded summaries live in `/Users/mbele/.claude/projects/-Users-mbele-Desktop-nex2-0/memory/`
and are indexed by `MEMORY.md`. Cross-link related memories with `[[name]]`.
