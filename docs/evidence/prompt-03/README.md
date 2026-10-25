# Prompt 03 — Administrator demo

Date: 2026-10-25 (Asia/Bangkok)

> Add an administrator interface for managing clubs and viewing registered students.

The user requested a simple demo for a class assignment, without a production backend or sign-in.

## Features

- Admin navigation and `/admin` dashboard with club, registration and distinct-student totals.
- Add and edit club name, emoji, category, tagline, description, schedule, location, advisor and maximum membership.
- Club selection and a roster with student name, student ID, email and registration date.
- Delete confirmation for empty clubs; clubs with members cannot be deleted.
- Validation prevents capacity reductions below existing membership.
- Persisted club changes flow into browsing/search, registration pages and My clubs.
- Compact club selector on smaller screens and club sidebar on larger screens.

## Verification

- Automated suite: 25 tests across 4 files passed. New catalog and route tests were observed failing before implementation.
- Production build passed.
- Type checking reports only the two previously existing TS4111 errors for `process.env.GITHUB_REPOSITORY` in `vite.config.ts:11`.
- Independent code review found no important regressions within the agreed local demo scope.
- Browser: created Demo Robotics Club with capacity 2, registered two demo students, and verified their roster and disabled deletion button.
- A capacity edit to 1 was rejected; an edit to 5 and an updated tagline were saved and reflected on the student page.
- Reloading Admin and the newly created club's direct URL retained the data.
- My clubs displayed both memberships; searching Robotics returned the added club.
- Cancelling an add form did not create a club. Created a temporary empty club, cancelled its deletion, then confirmed deletion; the temporary club was removed while other data remained intact.

## Screenshots

1. [Admin dashboard](01-admin-dashboard.jpg)
2. [Add club form](02-add-club.jpg)
3. [Registered students and deletion safeguard](03-registered-students.jpg)
4. [Capacity validation](04-capacity-protection.jpg)
5. [New club appears in search](05-new-club-in-search.jpg)
6. [Delete confirmation](06-delete-confirmation.jpg)

## Demo data and scope

Demo Robotics Club and its two clearly named demo students remain in the tested browser for presenting the assignment. The temporary deletion-test club was removed. Data stays in this browser's localStorage; clearing it resets the demo. The Admin page intentionally has no authentication, as requested. No deployment or push was performed.
