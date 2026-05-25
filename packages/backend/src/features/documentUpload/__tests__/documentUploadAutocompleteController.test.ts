import { beforeEach, describe, it } from 'vitest';
import { testPrismaClient } from '../../../test/testPrismaClient';

describe('DocumentUploadAutocompleteController', () => {
  let prisma: ReturnType<typeof testPrismaClient>;

  beforeEach(() => {
    prisma = testPrismaClient();
  });

  it.todo('DocumentUploadAutocompleteController');
});
