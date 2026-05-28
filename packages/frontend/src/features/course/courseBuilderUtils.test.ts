import { describe, expect, it } from 'vitest';
import {
  builderFormToPayload,
  courseBuilderPayloadToForm,
  courseBuilderSectionCompletion,
  courseBuilderValidationSummary,
  emptyBuilderForm,
  evaluatePublishChecklist,
  insertIntoGroup,
  parseVideoEmbedUrl,
  reindexOrder,
  reorderWithinGroup,
} from './courseBuilderUtils';
import type { BuilderLesson } from './courseBuilderUtils';

describe('reindexOrder', () => {
  it('assigns orderIndex by array position', () => {
    const result = reindexOrder([
      { id: 'a', orderIndex: 9 },
      { id: 'b', orderIndex: 4 },
      { id: 'c', orderIndex: 0 },
    ]);
    expect(result.map((item) => item.orderIndex)).toEqual([0, 1, 2]);
    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('reorderWithinGroup', () => {
  it('replaces only the matching items, keeping others in place', () => {
    const all = [
      { id: 'm1', group: 'A' },
      { id: 'x', group: 'B' },
      { id: 'm2', group: 'A' },
      { id: 'y', group: 'B' },
      { id: 'm3', group: 'A' },
    ];
    const reordered = [
      { id: 'm3', group: 'A' },
      { id: 'm1', group: 'A' },
      { id: 'm2', group: 'A' },
    ];
    const result = reorderWithinGroup(
      all,
      (item) => item.group === 'A',
      reordered,
    );
    expect(result.map((item) => item.id)).toEqual(['m3', 'x', 'm1', 'y', 'm2']);
  });
});

describe('insertIntoGroup', () => {
  const all = [
    { id: 'a', group: 'A' },
    { id: 'x', group: 'B' },
    { id: 'b', group: 'A' },
    { id: 'c', group: 'A' },
  ];
  const inGroup = (item: { group: string }) => item.group === 'A';

  it('inserts at the start of the group', () => {
    const result = insertIntoGroup(all, inGroup, { id: 'NEW', group: 'A' }, 0);
    expect(result.map((item) => item.id)).toEqual(['NEW', 'a', 'x', 'b', 'c']);
  });

  it('inserts in the middle of the group, keeping non-group slots', () => {
    const result = insertIntoGroup(all, inGroup, { id: 'NEW', group: 'A' }, 1);
    expect(result.map((item) => item.id)).toEqual(['a', 'x', 'NEW', 'b', 'c']);
  });

  it('appends when position is at or past the group length', () => {
    const result = insertIntoGroup(all, inGroup, { id: 'NEW', group: 'A' }, 3);
    expect(result.map((item) => item.id)).toEqual(['a', 'x', 'b', 'c', 'NEW']);
  });
});

describe('evaluatePublishChecklist', () => {
  it('flags every requirement as unmet for an empty course', () => {
    const items = evaluatePublishChecklist(emptyBuilderForm());
    expect(items.every((item) => !item.met)).toBe(true);
    expect(items.map((item) => item.key)).toContain('lessonsItem');
  });

  it('passes once title, description, thumbnail, modules, lessons, an assessment and an outcome are present', () => {
    const form = emptyBuilderForm();
    form.title = 'Course';
    form.description = 'A description';
    form.thumbnail = [{ id: 'f1' }] as never;
    form.audience = ['Exam candidates'];
    form.modules = [{ id: 'm1', title: 'M', description: '', orderIndex: 0 }];
    form.lessons = [1, 2, 3].map((n) => ({
      id: `l${n}`,
      moduleId: 'm1',
      title: 'L',
      description: '',
      content: n === 1 ? 'Lesson content' : '',
      videoFiles: [],
      videoUrl: '',
      resourceFiles: [],
      videoTranscriptText: null,
      videoTranscriptStatus: null,
      videoTranscriptSourceKey: null,
      videoTranscriptError: null,
      videoTranscriptGeneratedAt: null,
      videoDurationSeconds: null,
      isPreview: false,
      isHidden: false,
      orderIndex: n,
    }));
    form.quizzes = [
      {
        id: 'q1',
        moduleId: 'm1',
        lessonId: null,
        title: 'Q',
        description: '',
        passingScore: null,
        timeLimitMinutes: null,
        randomizeQuestions: false,
        randomizeAnswers: false,
        showExplanations: true,
        allowRetries: true,
        maxAttempts: null,
        orderIndex: 0,
      },
    ];
    form.outcomes = [{ id: 'o1', text: 'Learn things', orderIndex: 0 }];
    form.requirements = [{ id: 'r1', text: 'Basic knowledge', orderIndex: 0 }];
    form.flashcardSets = [
      {
        id: 'fs1',
        moduleId: 'm1',
        lessonId: null,
        title: 'Flashcards',
        description: '',
        orderIndex: 0,
      },
    ];

    const items = evaluatePublishChecklist(form);
    expect(items.every((item) => item.met)).toBe(true);
  });
});

describe('parseVideoEmbedUrl', () => {
  it('converts YouTube links to embed URLs', () => {
    expect(
      parseVideoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(parseVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );
  });

  it('converts Vimeo links to embed URLs', () => {
    expect(parseVideoEmbedUrl('https://vimeo.com/123456789')).toBe(
      'https://player.vimeo.com/video/123456789',
    );
  });

  it('returns null for empty or unrecognised links', () => {
    expect(parseVideoEmbedUrl('')).toBeNull();
    expect(parseVideoEmbedUrl(null)).toBeNull();
    expect(parseVideoEmbedUrl('https://example.com/video.mp4')).toBeNull();
  });
});

describe('builderFormToPayload', () => {
  it('regroups lessons by module and reindexes orderIndex', () => {
    const lesson = (id: string, moduleId: string): BuilderLesson => ({
      id,
      moduleId,
      title: 'Lesson',
      description: '',
      videoFiles: [],
      videoUrl: '',
      resourceFiles: [],
      videoTranscriptText: null,
      videoTranscriptStatus: null,
      videoTranscriptSourceKey: null,
      videoTranscriptError: null,
      videoTranscriptGeneratedAt: null,
      videoDurationSeconds: null,
      isPreview: false,
      isHidden: false,
      orderIndex: 0,
    });

    const form = emptyBuilderForm();
    form.title = '  Course  ';
    form.modules = [
      { id: 'm1', title: 'M1', description: '', orderIndex: 5 },
      { id: 'm2', title: 'M2', description: '', orderIndex: 1 },
    ];
    // intentionally stored out of module order
    form.lessons = [lesson('l-m2', 'm2'), lesson('l-m1', 'm1')];

    const payload = builderFormToPayload(form);

    expect(payload.title).toBe('Course');
    expect(payload.modules.map((module) => module.orderIndex)).toEqual([0, 1]);
    expect(payload.lessons.map((item) => item.id)).toEqual(['l-m1', 'l-m2']);
    expect(payload.lessons.map((item) => item.orderIndex)).toEqual([0, 1]);
  });

  it('preserves certificate settings and trims audience metadata', () => {
    const form = emptyBuilderForm();
    form.title = 'Course';
    form.certificateEnabled = false;
    form.audience = [' Students ', '', ' Career changers '];

    const payload = builderFormToPayload(form);

    expect(payload.certificateEnabled).toBe(false);
    expect(payload.audience).toEqual(['Students', 'Career changers']);
  });
});

describe('courseBuilderPayloadToForm', () => {
  it('recovers checkpoint payloads with defaults for missing or malformed fields', () => {
    const form = courseBuilderPayloadToForm({
      title: 'Recovered course',
      visibility: 'public',
      certificateEnabled: false,
      audience: ['Learners', '', 'Reviewers'],
      modules: [{ id: 'm1', title: 'Module', orderIndex: 'bad' }],
      lessons: [
        {
          id: 'l1',
          moduleId: 'm1',
          title: 'Lesson',
          videoDurationSeconds: 120,
          isPreview: true,
        },
      ],
      quizzes: [
        {
          id: 'q1',
          moduleId: 'm1',
          title: 'Quiz',
          showExplanations: false,
        },
      ],
    });

    expect(form.title).toBe('Recovered course');
    expect(form.visibility).toBe('public');
    expect(form.certificateEnabled).toBe(false);
    expect(form.audience).toEqual(['Learners', 'Reviewers']);
    expect(form.modules[0].orderIndex).toBe(0);
    expect(form.lessons[0].videoDurationSeconds).toBe(120);
    expect(form.lessons[0].isPreview).toBe(true);
    expect(form.quizzes[0].showExplanations).toBe(false);
    expect(form.quizzes[0].allowRetries).toBe(true);
  });

  it('defaults certificates to enabled when restoring older checkpoints', () => {
    const form = courseBuilderPayloadToForm({ title: 'Old checkpoint' });
    expect(form.certificateEnabled).toBe(true);
  });
});

describe('courseBuilderValidationSummary', () => {
  it('reports the next blocking section and section-level completion', () => {
    const form = emptyBuilderForm();
    form.title = 'Course';
    form.description = 'Description';

    const summary = courseBuilderValidationSummary(form);
    const landing = courseBuilderSectionCompletion(form, 'landing-page');

    expect(summary.blockingIssues.length).toBeGreaterThan(0);
    expect(summary.nextStep?.key).toBe('thumbnailItem');
    expect(landing.section).toBe('landing-page');
    expect(landing.met).toBeLessThan(landing.total);
  });
});
