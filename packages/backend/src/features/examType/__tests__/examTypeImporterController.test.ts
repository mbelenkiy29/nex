import { beforeEach, describe, it } from 'vitest';
import { testPrismaClient } from '../../../test/testPrismaClient';

describe('ExamTypeImporterController', () => {
  let prisma: ReturnType<typeof testPrismaClient>;

  beforeEach(() => {
    prisma = testPrismaClient();
  });

  it.todo('ExamTypeImporterController');
});
