# Prompt 02 — Search and category filters

Date: 2026-10-25 (Asia/Bangkok)

> Add a search box and allow students to filter clubs by category.

## Changes

- Added a labelled search field matching club names, taglines and descriptions, ignoring case and surrounding spaces.
- Connected search with the existing All, Tech, Sport, Culture and Creative category buttons.
- Added accessible selected-category state, live result counts, a clear-filters button and a no-results message.

## Verification

- All 14 tests across 3 files passed, including six search/filter tests.
- Production build passed (`npm run build`).
- Type check still reports the two existing TS4111 errors for `process.env.GITHUB_REPOSITORY` in `vite.config.ts:11`; no errors were reported in the new search files or updated page.
- Browser: Sport displays Badminton and Table Tennis (2 results); `  TENNIS  ` within Sport displays Table Tennis (1 result); switching to Tech preserves the query and displays No clubs found (0 results); Clear filters restores All, clears the search and displays all 10 clubs.
- Existing registration tests also passed.

## Screenshots

1. [Category filter](01-category-filter.jpg)
2. [Combined search and category](02-combined-search.jpg)
3. [No results](03-no-results.jpg)

Changes are local and have not been published or pushed.
