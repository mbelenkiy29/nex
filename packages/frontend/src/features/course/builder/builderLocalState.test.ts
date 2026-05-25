import { beforeEach, describe, expect, it } from 'vitest';
import { emptyBuilderForm } from '@/features/course/courseBuilderUtils';
import {
  builderLastSectionRead,
  builderLastSectionWrite,
  builderRecoveryClear,
  builderRecoveryRead,
  builderRecoveryWrite,
  builderSectionFromPath,
} from './builderLocalState';

describe('builder local state', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads and writes the last valid builder section', () => {
    expect(builderSectionFromPath('/course-builder/abc/curriculum')).toBe(
      'curriculum',
    );
    expect(builderSectionFromPath('/course-builder/abc/unknown')).toBeNull();

    builderLastSectionWrite('course-1', 'ai-assistant');
    expect(builderLastSectionRead('course-1')).toBe('ai-assistant');

    window.localStorage.setItem(
      'nexexam-course-builder-last-section:course-1',
      'unknown',
    );
    expect(builderLastSectionRead('course-1')).toBeNull();
  });

  it('stores, validates, and clears recovery snapshots by course id', () => {
    const form = emptyBuilderForm();
    form.title = 'Recovered draft';

    builderRecoveryWrite('course-1', form, '2026-05-25T00:00:00.000Z');
    const snapshot = builderRecoveryRead('course-1');

    expect(snapshot?.courseId).toBe('course-1');
    expect(snapshot?.serverUpdatedAt).toBe('2026-05-25T00:00:00.000Z');
    expect(snapshot?.form.title).toBe('Recovered draft');
    expect(builderRecoveryRead('course-2')).toBeNull();

    builderRecoveryClear('course-1');
    expect(builderRecoveryRead('course-1')).toBeNull();
  });

  it('ignores corrupted recovery snapshots', () => {
    window.localStorage.setItem(
      'nexexam-course-builder-recovery:course-1',
      '{not valid json',
    );

    expect(builderRecoveryRead('course-1')).toBeNull();
  });
});
