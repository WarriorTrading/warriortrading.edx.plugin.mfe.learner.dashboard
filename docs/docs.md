# Learner Dashboard MFE Customizations

Each section lists a feature required.

## Feature: Sort Learner Dashboard Course List, Alphabetically

The homepage of the Learner Dashboard, by default, doesn't sort alphabetically.  A learner would have to click on "refine" -> Title (A-Z)

We want the learner to land on that dashboard already sorted for them alphabetically.

Implementation: [`src/plugins/course-list-alphabetical/`](../src/plugins/course-list-alphabetical/index.js) (composed via root [`env.config.js`](../env.config.js)).

- [x] Sort course listing by Refine → Title (A–Z) on `/learner-dashboard` via FPF **Insert** on the course list slot ([`CourseListSlotAugment.js`](../src/plugins/course-list-alphabetical/CourseListSlotAugment.js)); verify after MFE image rebuild.

## Hide audit passing-grade banner (LM-123)

- In the `/learner-dashboard`, each enrolled course can show a blue strip: `Grade required to pass the course: XX%` (from **CertificateBanner**, not CourseBannerSlot).

Implementation: [`src/plugins/course-list-alphabetical/CourseListSlotAugment.js`](../src/plugins/course-list-alphabetical/CourseListSlotAugment.js) (composed via root [`env.config.js`](../env.config.js)) hides matching nodes under `.course-card-banners`. Operators may instead use brand SCSS and delete that logic (see [`README.md`](../README.md)).

- [x] (LM-123) Hide the audit passing-grade strip after MFE image rebuild (or replace with CSS-only approach documented in README).


