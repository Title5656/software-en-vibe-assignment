# Admin Demo Implementation Plan

**Goal:** Add a browser-local administrator interface for the class assignment.

**Architecture:** Keep the existing React/TanStack app and localStorage registrations. Add a persisted club catalog seeded from the original ten clubs, shared by all pages. No authentication or shared backend, as requested by the user.

**Tasks**

- [x] Test and implement catalog create/update/delete persistence, input validation, and member-count safeguards in `src/lib/club-store.ts`.
- [x] Connect catalog updates to browsing, club details and My clubs while preserving search and registration rules.
- [x] Add `/admin`, header navigation, club editor, deletion confirmation and per-club student roster.
- [x] Run all tests and production build, review integration, exercise the interface in the browser, and save screenshots under `docs/evidence/prompt-03`.

**Checks:** Reload retains edits; newly added clubs support registration; occupied clubs cannot be deleted; capacity cannot drop below current membership; student rosters remain scoped to the selected club; cancel actions do not alter data. Existing work remains in the current checkout and no commits, pushes or deployment are needed for this demo.
