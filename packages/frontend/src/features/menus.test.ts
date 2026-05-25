import { describe, it, expect } from 'vitest';
import { dictionaries } from '@project/backend/translation/getDictionary';
import { defaultLocale } from '@project/backend/translation/locales';
import { menus } from './menus';

const dictionary = dictionaries[defaultLocale];
const allowAll = () => true;

function menuIds(options?: { isPlatformAdmin?: boolean; isCreator?: boolean }) {
  return menus(dictionary, allowAll, options).map((menu) => menu.id);
}

describe('menus — role-based dashboard navigation', () => {
  it('shows the student nav (and not the creator dashboard) for a student', () => {
    const ids = menuIds({ isCreator: false });
    expect(ids).toContain('studentDashboard');
    expect(ids).toContain('studentMyCourses');
    expect(ids).not.toContain('creatorDashboard');
    expect(ids).not.toContain('platformAdmin');
  });

  it('shows the creator dashboard and hides student items for a teacher', () => {
    const ids = menuIds({ isCreator: true });
    expect(ids).toContain('creatorDashboard');
    expect(ids).not.toContain('studentDashboard');
    expect(ids).not.toContain('studentPractice');
    expect(ids).not.toContain('platformAdmin');
  });

  it('keeps the creator-application link visible to students (the on-ramp)', () => {
    expect(menuIds({ isCreator: false })).toContain('creatorApplication');
  });

  it('shows only the admin nav for a platform admin', () => {
    const ids = menuIds({ isPlatformAdmin: true });
    expect(ids).toContain('platformAdmin');
    expect(ids).not.toContain('studentDashboard');
    expect(ids).not.toContain('creatorDashboard');
  });
});
