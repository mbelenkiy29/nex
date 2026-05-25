import { describe, it, expect, beforeEach } from 'vitest';
import {
  dashboardViewFromPath,
  dashboardHomePath,
  dashboardPersonaGet,
  dashboardPersonaSet,
  dashboardPersonaClear,
} from './dashboardHome';

describe('dashboardViewFromPath', () => {
  it('maps the admin namespace to superAdmin', () => {
    expect(dashboardViewFromPath('/admin')).toBe('superAdmin');
    expect(dashboardViewFromPath('/admin/courses')).toBe('superAdmin');
  });

  it('maps the creator namespace to creator', () => {
    expect(dashboardViewFromPath('/creator')).toBe('creator');
    expect(dashboardViewFromPath('/creator/anything')).toBe('creator');
  });

  it('maps the student namespace to student', () => {
    expect(dashboardViewFromPath('/student')).toBe('student');
    expect(dashboardViewFromPath('/student/practice')).toBe('student');
  });

  it('returns null for unrelated paths', () => {
    expect(dashboardViewFromPath('/course')).toBeNull();
    expect(dashboardViewFromPath('/')).toBeNull();
  });
});

describe('dashboardHomePath', () => {
  it('always routes a platform admin to /admin', () => {
    expect(dashboardHomePath({ isPlatformAdmin: true })).toBe('/admin');
    expect(dashboardHomePath({ isPlatformAdmin: true, persona: 'student' })).toBe(
      '/admin',
    );
  });

  it('routes a creator persona to /creator', () => {
    expect(
      dashboardHomePath({ isPlatformAdmin: false, persona: 'creator' }),
    ).toBe('/creator');
  });

  it('defaults to /student for a student persona or no persona', () => {
    expect(
      dashboardHomePath({ isPlatformAdmin: false, persona: 'student' }),
    ).toBe('/student');
    expect(dashboardHomePath({ isPlatformAdmin: false })).toBe('/student');
  });
});

describe('dashboardPersona storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when nothing is stored', () => {
    expect(dashboardPersonaGet()).toBeNull();
  });

  it('persists and clears a persona', () => {
    dashboardPersonaSet('creator');
    expect(dashboardPersonaGet()).toBe('creator');

    dashboardPersonaSet('student');
    expect(dashboardPersonaGet()).toBe('student');

    dashboardPersonaClear();
    expect(dashboardPersonaGet()).toBeNull();
  });

  it('ignores an invalid stored value', () => {
    window.localStorage.setItem('nexexam.dashboardPersona', 'bogus');
    expect(dashboardPersonaGet()).toBeNull();
  });
});
