-- Backfill legacy lesson Markdown into typed paragraph blocks before product
-- code stops rendering CourseLesson.content directly.

WITH lessons_to_backfill AS (
    SELECT
        l."id",
        btrim(l."content") AS "text"
    FROM "CourseLesson" l
    WHERE l."content" IS NOT NULL
      AND btrim(l."content") <> ''
      AND NOT EXISTS (
          SELECT 1
          FROM "CourseLessonBlock" b
          WHERE b."lessonId" = l."id"
            AND b."blockType" = 'paragraph'
            AND b."content" ->> 'text' = btrim(l."content")
      )
),
shift_existing_blocks AS (
    UPDATE "CourseLessonBlock" b
    SET
        "orderIndex" = b."orderIndex" + 1,
        "updatedAt" = now()
    FROM lessons_to_backfill l
    WHERE b."lessonId" = l."id"
    RETURNING b."id"
)
INSERT INTO "CourseLessonBlock" (
    "lessonId",
    "blockType",
    "content",
    "orderIndex",
    "updatedAt"
)
SELECT
    l."id",
    'paragraph',
    jsonb_build_object('text', l."text"),
    0,
    now()
FROM lessons_to_backfill l;
