# Prompt 01 — Club registration rules

Date: 2026-10-25 (Asia/Bangkok)

> Students cannot register for the same club more than once, and each club has a maximum number of member

## Changes

- Check duplicate membership by both club ID and student ID, allowing different students to join the same club.
- Enforce each club's existing capacity before saving a registration.
- Show member counts and remaining places, disable registration when full, and show a duplicate-registration alert.
- Allow another student to register after a successful submission.
- Cancel only the selected student's membership, preserving other members and reopening a place.

## Verification

- Automated tests: 8 passed across 2 files. The new tests first reproduced rejection of a different student, incorrect full-club errors, and cancellation removing everyone.
- Production build: passed (`npm run build`).
- Type check: blocked by two existing TS4111 errors for `process.env.GITHUB_REPOSITORY` in `vite.config.ts:11`. No remaining type errors in the changed files.
- Browser: registered 30 distinct demo students in Table Tennis (capacity 30); duplicate student 9000001 was rejected without increasing the count. At 30/30, fields and the join button were disabled. Refresh retained the full state. Cancelling one student left 29 members and reopened one place without deleting other students.
- Demo registrations were removed after testing.

## Screenshots

1. [Registration success](01-registration-success.jpg)
2. [Duplicate registration blocked](02-duplicate-blocked.jpg)
3. [Club full at 30/30](03-club-full.jpg)
4. [Place reopened after cancellation](04-place-reopened.jpg)

## Scope

The existing application stores registrations in browser localStorage. These rules apply to the registrations in that browser. Enforcing shared membership and capacity across devices requires a backend with authenticated student identity, a unique student/club constraint, and atomic capacity checks.

Changes are local to this repository; they have not been published or pushed.
