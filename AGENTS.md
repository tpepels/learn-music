# Repository working rules

## Before changing the repository

1. Refresh exact `main`, open PRs/issues, recent commits and relevant Actions.
2. Branch from the exact current `main`.
3. Keep changes coherent and reversible.
4. Do not add temporary `push` triggers to branch CI. Repeated push-triggered validation creates unnecessary GitHub Actions runs and email notifications.
5. Finish the coherent change set first, then create a draft PR. Mark it ready for review only when it is ready for one validation cycle; that `ready_for_review` event triggers typecheck, full tests and production build once.
6. If validation fails, convert the PR back to draft before making fixes. Consolidate fixes, then mark it ready again for one new validation cycle. Do not leave CI running on every corrective commit.
7. Merge only when the branch is not behind current `main` and the latest deliberate validation cycle is green.
8. Verify the exact-main GitHub Pages build and deployment.

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
