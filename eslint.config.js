import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/prisma/generated/**',
      '**/.husky/**',
      '**/*.d.ts',
      '**/public/**',
      'packages/mobile/**',
      'packages/deploy/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // TypeScript itself reports undefined identifiers (that is what our
      // typecheck step does); the core rule only false-positives on TS.
      'no-undef': 'off',
      // Genuine bug-catchers — keep as errors.
      'react-hooks/rules-of-hooks': 'error',
      // Advisory: large existing surface, surfaced as warnings so the lint
      // gate stays green while still flagging issues in new/changed code.
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-prototype-builtins': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-assignment': 'warn',
      'preserve-caught-error': 'warn',
      // Only require `const` when every destructured binding can be const.
      'prefer-const': ['error', { destructuring: 'all' }],
      // bypass-RLS audit gate (security audit finding #14). Importing the
      // RLS-bypass Prisma client must be a deliberate, documented choice.
      // Every legitimate call site has a `// bypass-RLS: <reason>` comment
      // immediately above the import plus an `// eslint-disable-next-line
      // no-restricted-syntax` to silence this rule for that one line.
      // Forgetting either yields a lint failure with the message below.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ImportSpecifier[imported.name="prismaDangerouslyBypassRLS"]',
          message:
            'bypass-RLS: importing `prismaDangerouslyBypassRLS` skips multi-tenant Row Level Security. Add a `// bypass-RLS: <reason>` comment above the import explaining why, then `// eslint-disable-next-line no-restricted-syntax` immediately before this line. See security-audit-2026-05-23 finding #14.',
        },
      ],
    },
  },
);
