import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import {
  LuClipboardCheck,
  LuCircleCheck,
  LuImage,
  LuLayers,
  LuListChecks,
  LuSend,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import {
  courseBuilderSectionCompletion,
  type CourseBuilderSection,
} from '@/features/course/courseBuilderUtils';
import { Badge } from '@/shared/components/ui/badge';
import { useBuilder } from './BuilderContext';

const navItemClass =
  'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-white/70 hover:text-foreground dark:hover:bg-white/8';
const navItemActiveClass = 'bg-primary/10 text-primary hover:bg-primary/10';

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-muted-foreground px-3 pt-2 text-[11px] font-bold tracking-wide uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function SectionBadge({
  section,
  value,
}: {
  section?: CourseBuilderSection;
  value?: number;
}) {
  const { form } = useBuilder();
  const completion = section
    ? courseBuilderSectionCompletion(form, section)
    : null;
  const complete =
    Boolean(completion) &&
    completion!.total > 0 &&
    completion!.blocking.length === 0 &&
    completion!.warnings.length === 0;

  if (completion && completion.total > 0) {
    return complete ? (
      <LuCircleCheck className="ml-auto size-4 text-emerald-500" />
    ) : (
      <Badge variant="outline" className="ml-auto rounded-lg px-1.5 text-[10px]">
        {completion.met}/{completion.total}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="ml-auto rounded-lg px-1.5 text-[10px]">
      {value || 0}
    </Badge>
  );
}

// Left-hand builder navigation — Udemy-style phased sections (Plan / Content /
// Publish). Each item is its own route so sections are deep-linkable.
export function BuilderSidebar() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const nav = dictionary.course.builder.nav;
  const { courseId, form } = useBuilder();
  const params = { courseId };

  return (
    <nav className="nex-glass-card h-fit rounded-3xl p-3 lg:sticky lg:top-28">
      <div className="grid gap-2">
        <NavGroup label={nav.plan}>
          <Link
            to="/creator/courses/$courseId/edit/goals"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuTarget className="size-4" />
            {nav.goals}
            <SectionBadge section="goals" />
          </Link>
          <Link
            to="/creator/courses/$courseId/edit/landing-page"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuImage className="size-4" />
            {nav.landingPage}
            <SectionBadge section="landing-page" />
          </Link>
        </NavGroup>

        <NavGroup label={nav.content}>
          <Link
            to="/creator/courses/$courseId/edit/curriculum"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuListChecks className="size-4" />
            {nav.curriculum}
            <SectionBadge section="curriculum" />
          </Link>
          <Link
            to="/creator/courses/$courseId/edit/practice-exams"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuClipboardCheck className="size-4" />
            {nav.practiceExams}
            <SectionBadge value={form.practiceExams.length} />
          </Link>
          <Link
            to="/creator/courses/$courseId/edit/flashcards"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuLayers className="size-4" />
            {nav.flashcards}
            <SectionBadge value={form.flashcardSets.length} />
          </Link>
          <Link
            to="/creator/courses/$courseId/edit/ai-assistant"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuSparkles className="size-4" />
            {nav.aiAssistant}
            <SectionBadge value={0} />
          </Link>
        </NavGroup>

        <NavGroup label={nav.publish}>
          <Link
            to="/creator/courses/$courseId/edit/submit"
            params={params}
            className={navItemClass}
            activeProps={{ className: navItemActiveClass }}
          >
            <LuSend className="size-4" />
            {nav.submit}
            <SectionBadge section="submit" />
          </Link>
        </NavGroup>
      </div>
    </nav>
  );
}
