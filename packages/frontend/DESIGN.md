# NexExam frontend design standard

> Read this on every UI change — adding a new component, retrofitting a screen, or
> wiring a new flow. It's short on purpose. If a rule conflicts with a real product
> need, propose an exception in the PR; do not silently bend a rule.

The principles below adapt OpenAI's Apps SDK UX + UI guidelines to NexExam's
context. NexExam is a standalone Vite + React + TanStack-Router SPA, not a
ChatGPT App, so surfaces like _inline card with composer_, _fullscreen-with-composer_,
and _picture-in-picture_ don't apply. The underlying principles — atomic actions,
no ornamental UI, accessibility, restrained color, system typography — do.

## 1. Focused, atomic surfaces

Each card and each page does **one job**. The course player's right aside is a
column of independent cards — `LessonAiActions`, `StudyCoachPanel`,
`OneOnOneEntryCard`, `LessonNoteQuickAdd` — not one mega-card. When a new
concept needs to surface, extract a new card next to the existing ones; don't
pile responsibilities into an existing card.

## 2. Two primary CTAs max per card

One primary action, optionally one secondary (`variant="ghost"` or
`"outline"`). Multiple equal-weight buttons read as indecision. Destructive
actions (`variant="destructive"`) count toward the cap when they're the
primary intent of the surface (e.g. `CancelSessionDialog`'s "Yes, cancel").

## 3. No deep navigation inside a card

Cards link out — to a route or a `Dialog` / `Sheet` — for drill-in flows.
`OneOnOneEntryCard`'s "Book a 1:1" button opens `BookSessionDialog`; it does
not embed a multi-step wizard inside the card.

## 4. No nested scrolling

Cards auto-fit their content; the page scrolls, not an inner div. Documented
exceptions: a constrained slot grid (`BookSessionDialog`'s `max-h-64`
grid of slot buttons) or a notes list inside a `Sheet`. New scrollables need
an explicit justification.

## 5. Empty states are required

Every list / query view has a one-sentence empty state pointing at the next
action. See `MySessionsList`'s `emptyUpcoming` / `emptyPast`,
`StudyPlanList`'s "Add an item", `SessionTypeEditor`'s `empty` text. The empty
state lives in the dictionary, not as inline English.

## 6. Restrained color

Use the design tokens — `text-foreground`, `text-muted-foreground`, `bg-card`,
`bg-muted`, `border`, `border-destructive`, `text-destructive` — never raw hex.
The brand accent (`text-primary`, `bg-primary`) goes on the primary CTA, the
active tab, badges, and small icons paired with headings — **never** on a
content background or body text. No custom gradients in content areas.

## 7. Typography

Inherit the system stack — don't import a font. Stick to the project's scale:

- `text-xl font-extrabold` — page titles
- `font-extrabold` (default size) — card headers
- `text-sm` — body
- `text-xs text-muted-foreground` — metadata / hints
- `text-destructive text-sm` — inline errors

Don't introduce a custom font size or weight for a single component.

## 8. Spacing & layout

Primary cards match the `nex-glass-card` aesthetic:

```tsx
<Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
  <CardContent className="space-y-4 p-5">{/* …content… */}</CardContent>
</Card>
```

Use `space-y-{2,3,4,5}` consistently within a surface. Don't mix vertical
rhythms (`space-y-2` in one card, `space-y-6` in the next sibling) without a
reason.

## 9. Iconography

`react-icons/lu` (Lucide, outlined, monochromatic) is the only icon source.
Inline / inside buttons → `size-4`. Paired with a card-header title → `size-5`,
class `text-primary`. No filled / multi-color icon sets. No logos as
decoration in cards.

## 10. Accessibility (WCAG AA)

- Every **icon-only button** has an `aria-label` (the icon alone is not a name).
- Every **image** has `alt`.
- Every **`Input` / `Textarea` / `Select`** is paired with a `Label htmlFor=` (or
  a wrapping `<Label>` with `flex` for switches).
- Inline errors get `role="alert"` so screen readers announce them.
- Focus rings come from shadcn defaults; never `outline-none` without a
  visible replacement.
- Color contrast in custom-colored badges / overlays meets AA — the design
  tokens already do.
- Respect text resizing: avoid fixed pixel heights on text containers.

## 11. Use shadcn primitives

The toolkit: `Card`, `Button`, `Dialog`, `Sheet`, `Tabs`, `Badge`, `Input`,
`Textarea`, `Switch`, `Label`, `Select`, `RadioGroup`, `Spinner`. Introduce
a new primitive only when no composition of these works.

## 12. Async state

Loading uses `<Spinner className="size-4" />` with muted-foreground supporting
text — never a custom spinner. Mutations disable their primary button while
`isPending`; never block the entire surface with a full-screen spinner unless
the outcome requires it.

## 13. Don't duplicate system features

Don't render a top-right modal close-X — `Dialog` / `Sheet` already provide
one. Don't reimplement `Tabs` with `<button>`s. Don't recolor the global
sidebar. Don't ship a back button when the route's `back` works.

---

## Quick PR checklist

Before opening a PR with UI changes, sanity-check each touched surface:

- [ ] One job per card / page.
- [ ] One primary CTA (plus optional ghost/outline secondary).
- [ ] Empty state present and dictionary-driven.
- [ ] Color via tokens, not raw hex.
- [ ] Icons from `react-icons/lu`, sized `size-4` / `size-5`.
- [ ] Every input has a `Label htmlFor=`.
- [ ] Every icon-only button has `aria-label`.
- [ ] Errors have `role="alert"`.
- [ ] Loading uses `<Spinner className="size-4" />`.
- [ ] No nested scrolling outside the documented exceptions.

---

## Out of scope

- A ChatGPT Apps SDK companion (would need its own UX rules; defer until shipped).
- Lint rules / Storybook to enforce the standard mechanically — future work.
- A visual rebrand of legacy surfaces (dashboard, exam taker, course builder) —
  those follow this standard on next touch, not in a sweep.
