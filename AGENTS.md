# Repository working rules

## Before changing the repository

1. Refresh exact `main`, open PRs/issues, recent commits and relevant Actions.
2. Branch from the exact current `main`.
3. Keep changes coherent and reversible.
4. Run typecheck, full tests and production build.
5. Restore manual-only feature-branch CI before merging.
6. Merge only when the branch is not behind current `main`.
7. Verify the exact-main GitHub Pages build and deployment.

## Schoenberg composition track

Before changing any Schoenberg lesson, source example, composition-study UI, or notation renderer, read:

- `SCHOENBERG_ARCHITECTURE.md` - product, terminology, layout and code-ownership rules.
- `SCHOENBERG_COVERAGE.md` - source-fidelity ledger and transcription status.

These files are part of the implementation contract, not optional background notes.

Do not add another Schoenberg lesson while S01-S05 have unresolved reference-integrity, source-fidelity, notation, or readability defects.

The most important learner-facing terminology rule is:

- **Exercise** = a PLAY / LAB lesson step identified by a letter such as A, B, C.
- Schoenberg's book indices such as `Ex. 2e` or `Ex. 35a` are **internal provenance only**.

Do not expose book index numbers in lesson titles, instructions, explanations, completion text, source-card headings or analysis-tab labels. Name the music or the musical idea instead.
